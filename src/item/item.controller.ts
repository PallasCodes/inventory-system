import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { Auth } from '../auth/decorators'
import { CreateCategoryDto } from './dto/create-category.dto'
import { GenerateSkuPrefixDto } from './dto/generate-sku-prefix.dto'

@Auth()
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('counts')
  getCounts() {
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

  @Post('generateSkuPrefix')
  generateSkuPrefix(@Body() generateSkuPrefixDto: GenerateSkuPrefixDto) {
    return this.itemService.generateSkuPrefix(generateSkuPrefixDto)
  }

  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.itemService.createCategory(createCategoryDto)
  }

  @Get('category')
  findAllCategories() {
    return this.itemService.findAllCategories()
  }

  @Delete('category/:idCategory')
  deleteCategory(@Param('idCategory') idCategory: string) {
    return this.itemService.deleteCategory(idCategory)
  }

  @Get('category/:idCategory/items')
  findCategoryItems(@Param('idCategory') idCategory: string) {
    return this.itemService.findItemsByCategory(idCategory)
  }

  @Get('category/:idCategory')
  findCategory(@Param('idCategory') idCategory: string) {
    return this.itemService.findCategory(idCategory)
  }

  @Delete('singleItem/:sku')
  deleteSingleItem(@Param('sku') sku: string) {
    return this.itemService.deleteSingleItem(sku)
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
