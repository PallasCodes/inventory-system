import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { Auth } from '../auth/decorators'
import { CreateCategoryDto } from './dto/create-category.dto'

@Auth()
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('counts')
  test() {
    return this.itemService.getItemsCount()
  }

  @Post()
  createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto)
  }

  @Get()
  findAllItems() {
    return this.itemService.findAllItems()
  }

  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.itemService.createCategory(createCategoryDto)
  }

  @Get('category')
  findAllCategories() {
    return this.itemService.findAllCategories()
  }

  @Get('category/:idCategory/items')
  findCategoryItems(@Param('idCategory') idCategory: string) {
    return this.itemService.findItemsByCategory(idCategory)
  }

  @Get('category/:idCategory')
  findCategory(@Param('idCategory') idCategory: string) {
    return this.itemService.findCategory(idCategory)
  }

  @Get('singleItem/:sku')
  findOneSingleItem(@Param('sku') sku: string) {
    return this.itemService.findOneSingleItem(sku)
  }

  @Get(':id')
  findOneItem(@Param('id') id: string) {
    return this.itemService.findOneItem(id)
  }
}
