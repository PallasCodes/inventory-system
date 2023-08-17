import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Category, Item } from './entities'

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const { categoryId } = createItemDto

      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      })

      if (!category)
        throw new BadRequestException(
          `There's no category with the given ID: ${categoryId}`,
        )

      const item = this.itemRepository.create(createItemDto)
      item.category = category
      await this.itemRepository.save(item)

      return item
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  findAll() {
    return `This action returns all item`
  }

  findOne(id: number) {
    return `This action returns a #${id} item`
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`
  }

  remove(id: number) {
    return `This action removes a #${id} item`
  }
}
