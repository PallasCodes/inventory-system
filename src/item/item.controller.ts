import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Auth } from 'src/auth/decorators'
import { CreateCategoryDto } from './dto/create-category.dto'

// @Auth()
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto)
  }

  @Auth()
  @Get()
  findAllItems() {
    return this.itemService.findAllItems()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id)
  }

  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.itemService.createCategory(createCategoryDto)
  }

  @Get('category')
  findAllCategories() {
    return this.itemService.findAllCategories()
  }

  @Get(':id')
  findOneItem(@Param('id') id: string) {
    return this.itemService.findOneItem(id)
  }
}
