import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Category, Item } from './entities'
import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createItem(createItemDto: CreateItemDto) {
    try {
      const { categoriesIds } = createItemDto
      const item = this.itemRepository.create(createItemDto)

      if (categoriesIds?.length > 0) {
        const categories = await this.categoryRepository.findBy({
          id: In(categoriesIds),
        })
        console.log(
          '🚀 ~ file: item.service.ts:27 ~ ItemService ~ createItem ~ categories:',
          categories,
        )

        if (!categories)
          throw new BadRequestException(
            'There are no categories with the given IDs',
          )

        item.categories = categories
      }

      await this.itemRepository.save(item)

      return item
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  async findAllItems() {
    try {
      const items = await this.itemRepository.find()
      return items
    } catch (error) {}
  }

  async findOneItem(id: string) {
    const item = await this.itemRepository.findOneBy({ id })
    if (item) return item
    throw new BadRequestException(`Item not found with the given ID: ${id}`)
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`
  }

  remove(id: number) {
    return `This action removes a #${id} item`
  }

  async createCategory(createCategory: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.create(createCategory)
      await this.categoryRepository.save(category)

      return category
    } catch (error) {
      console.log(error)
    }
  }

  async findAllCategories() {
    const categories = await this.categoryRepository.find()
    return categories
  }
}
