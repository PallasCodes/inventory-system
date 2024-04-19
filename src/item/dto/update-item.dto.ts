import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateItemDto } from './create-item.dto'
import { IsUUID } from 'class-validator'
import { Category } from '../entities'

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty()
  @IsUUID('4')
  idItem: string

  categories?: Category[]
}
