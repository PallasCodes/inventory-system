import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { CreateItemDto } from './dto/create-item.dto'
import { Category, Item, SingleItemStatus } from './entities'
import { CreateCategoryDto } from './dto/create-category.dto'
import { SingleItem } from './entities/single-item.entity'
import { handleDBError } from '../utils/handleDBError'
import {
  CustomResponse,
  MessageComponent,
  MessageType,
  ResponseMessage,
} from '../utils/CustomResponse'
import { GenerateSkuPrefixDto } from './dto/generate-sku-prefix.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SingleItem)
    private readonly singleItemRepository: Repository<SingleItem>,
    @InjectRepository(SingleItemStatus)
    private readonly singleItemStatusRepository: Repository<SingleItemStatus>,
  ) {}

  async getItemCountById(idItem: string) {
    const queryResults = await this.singleItemRepository.query(`
      SELECT
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 1 THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 2 THEN 1 ELSE 0 END) AS not_available,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 3 THEN 1 ELSE 0 END) AS borrowed,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 4 THEN 1 ELSE 0 END) AS fixing
      FROM single_items si
      WHERE si."itemIdItem" = '${idItem}'
    `)

    const counts = queryResults[0]

    return counts
  }

  async getItemsCount() {
    const queryResults = await this.singleItemRepository.query(`
      SELECT 
	      SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 1 THEN 1 ELSE 0 END) AS available,
	      SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 2 THEN 1 ELSE 0 END) AS not_available,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 3 THEN 1 ELSE 0 END) AS borrowed,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 4 THEN 1 ELSE 0 END) AS fixing
      FROM single_items
    `)

    const counts = queryResults[0]

    for (const key in counts) {
      counts[key] = parseInt(counts[key], 10)
    }

    counts.totals = Object.values(counts).reduce(
      (pv: any, cv: any) => pv + cv,
      0,
    )

    return new CustomResponse(counts)
  }

  async createItem(createItemDto: CreateItemDto) {
    const {
      categoriesIds,
      singleItems: singleItemsData,
      ...itemData
    } = createItemDto

    try {
      const statusCatalog = await this.singleItemStatusRepository.find()

      const auxSingleItems: SingleItem[] = []

      for (const singleItem of singleItemsData) {
        const singleItemStatus = statusCatalog.filter(
          (status) =>
            status.idSingleItemStatus === singleItem.idSingleItemStatus,
        )[0]

        if (!singleItemStatus)
          throw new BadRequestException('Single Item Status not found')

        const newSingleItem = this.singleItemRepository.create(singleItem)
        newSingleItem.singleItemStatus = singleItemStatus
        await this.singleItemRepository.save(newSingleItem)

        auxSingleItems.push(newSingleItem)
      }

      const categories = await this.categoryRepository.findBy({
        idCategory: In(categoriesIds),
      })

      if (!categories)
        throw new BadRequestException(
          'There are no categories with the given IDs',
        )

      const item = this.itemRepository.create(itemData)

      item.categories = categories
      item.numTotalItems = auxSingleItems.length
      item.numAvailableItems = auxSingleItems.filter(
        (singleItem) => singleItem.singleItemStatus.idSingleItemStatus === 1,
      ).length
      item.numUnavailableItems = auxSingleItems.filter(
        (singleItem) => singleItem.singleItemStatus.idSingleItemStatus === 2,
      ).length
      item.numFixingItems = auxSingleItems.filter(
        (singleItem) => singleItem.singleItemStatus.idSingleItemStatus === 4,
      ).length
      item.numBorrowedItems = 0
      item.singleItems = auxSingleItems

      await this.itemRepository.save(item)

      return item
    } catch (error) {
      handleDBError(error)
    }
  }

  async findAllItems() {
    const items = await this.itemRepository.find({ relations: ['categories'] })

    return new CustomResponse(items)
  }

  async findItemsByCategory(idCategory: string) {
    const categoryItems = await this.itemRepository.find({
      where: { categories: { idCategory } },
      relations: ['categories'],
    })
    return new CustomResponse(categoryItems)
  }

  async findOneItem(idItem: string) {
    const item = await this.itemRepository.findOne({
      where: { idItem },
      relations: ['singleItems', 'singleItems.singleItemStatus'],
    })
    if (!item)
      throw new BadRequestException(
        `Item not found with the given ID: ${idItem}`,
      )

    return new CustomResponse(item)
  }

  async createCategory(createCategory: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.create(createCategory)
      await this.categoryRepository.save(category)

      return new CustomResponse(
        category,
        new ResponseMessage(
          'Categoría registrada correctamente',
          MessageComponent.TOAST,
          MessageType.SUCCESS,
        ),
      )
    } catch (error) {
      handleDBError(error)
    }
  }

  async findAllCategories() {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    })

    return new CustomResponse(categories)
  }

  async findOneSingleItem(sku: string) {
    const singleItem = await this.singleItemRepository.findOneBy({ sku })
    if (!singleItem)
      throw new BadRequestException(
        `Single Item with the given SKU (${sku}) not found`,
      )

    return new CustomResponse(singleItem)
  }

  async findCategory(idCategory: string) {
    let category, itemsCount, singleItemsCount

    const getCategory = async () => {
      category = await this.categoryRepository.findOne({
        where: { idCategory },
      })
    }

    const getItemsCount = async () => {
      itemsCount = await this.itemRepository.count({
        where: { categories: { idCategory } },
      })
    }

    const getSingleItemsCount = async () => {
      singleItemsCount = await this.singleItemRepository.count({
        where: { item: { categories: { idCategory } } },
      })
    }

    await Promise.all([getCategory(), getItemsCount(), getSingleItemsCount()])

    if (!category)
      throw new BadRequestException(
        `Category with the given ID (${idCategory}) not found`,
      )

    return new CustomResponse({ category, itemsCount, singleItemsCount })
  }

  async deleteCategory(idCategory: string) {
    await this.categoryRepository
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('idCategory = :idCategory', { idCategory })
      .execute()

    return new CustomResponse(
      { message: 'Category deleted succesfully' },
      new ResponseMessage(
        'Categoría eliminada',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }

  async generateSkuPrefix(generateSkuPrefixDto: GenerateSkuPrefixDto) {
    let auxSkuPrefix = generateSkuPrefixDto.skuPrefix.toUpperCase()

    let items = await this.itemRepository.find({
      where: { skuPrefix: auxSkuPrefix },
    })

    while (items.length > 0) {
      auxSkuPrefix += (
        String.fromCharCode(0 | (Math.random() * 26 + 97)) +
        String.fromCharCode(0 | (Math.random() * 26 + 97))
      ).toUpperCase()

      items = await this.itemRepository.find({
        where: { skuPrefix: auxSkuPrefix },
      })
    }

    return new CustomResponse({ skuPrefix: auxSkuPrefix })
  }

  async deleteSingleItem(sku: string) {
    const singleItem = await this.singleItemRepository.findOneBy({ sku })

    if (!singleItem) {
      throw new BadRequestException(
        `No single item found with the given SKU: ${sku}`,
      )
    }

    await this.singleItemRepository.remove(singleItem)

    return new CustomResponse(
      singleItem,
      new ResponseMessage(
        'Item eliminado correctamente',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = this.categoryRepository.findOneByOrFail({
      idCategory: updateCategoryDto.idCategory,
    })

    await this.categoryRepository.update(
      updateCategoryDto.idCategory,
      updateCategoryDto,
    )

    return new CustomResponse(
      updatedCategory,
      new ResponseMessage(
        'Categoría actualizada correctamente',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }
}
