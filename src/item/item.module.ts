import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'
import { Category, Item, SingleItem, SingleItemStatus } from './entities'
import { ItemCatalogsController } from './item-catalogs.controller'
import { ItemCatalogsService } from './item-catalogs.service'

@Module({
  controllers: [ItemController, ItemCatalogsController],
  providers: [ItemService, ItemCatalogsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Item, Category, SingleItem, SingleItemStatus]),
  ],
})
export class ItemModule {}
