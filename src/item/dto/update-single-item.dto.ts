import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateSingleItemDto } from './create-single-item.dto'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { SingleItemStatus } from '../entities'

export class UpdateSingleItemDto extends PartialType(CreateSingleItemDto) {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  sku: string

  singleItemStatus?: SingleItemStatus
}
