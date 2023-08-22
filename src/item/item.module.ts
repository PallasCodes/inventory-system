import { Module } from '@nestjs/common'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'
import { AuthModule } from 'src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category, Item } from './entities'
import { SingleItem } from './entities/single-item.entity'

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [AuthModule, TypeOrmModule.forFeature([Item, Category, SingleItem])],
})
export class ItemModule {}
