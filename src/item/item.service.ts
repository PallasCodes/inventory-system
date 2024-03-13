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

  async getItemsCount() {
    const queryResults = await this.singleItemRepository.query(`
      SELECT 
	      SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 1 THEN 1 ELSE 0 END) AS available,
	      SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 2 THEN 1 ELSE 0 END) AS not_available,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 3 THEN 1 ELSE 0 END) AS fixing,
        SUM(CASE WHEN "singleItemStatusIdSingleItemStatus" = 4 THEN 1 ELSE 0 END) AS borrowed
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
      item.numBorrowedItems = 0
      item.singleItems = auxSingleItems

      await this.itemRepository.save(item)

      return item
    } catch (error) {
      handleDBError(error)
    }
  }

  async findAllItems() {
    const items = await this.itemRepository.find()
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
    const category = await this.categoryRepository.findOneBy({ idCategory })
    if (!category)
      throw new BadRequestException(
        `Category with the given ID (${idCategory}) not found`,
      )

    return new CustomResponse(category)
  }
}
