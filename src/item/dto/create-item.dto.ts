import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { CreateSingleItemDto } from './create-single-item.dto'

export class CreateItemDto {
  @ApiProperty({ nullable: false, minLength: 1, maxLength: 160 })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name: string

  @ApiProperty({ nullable: true, minLength: 1, maxLength: 500 })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  description: string

  @ApiProperty({ nullable: false, minimum: 1, maximum: 999999 })
  @IsNumber()
  @Min(1)
  @Max(999999)
  amount: number

  @ApiProperty({
    nullable: true,
    example: ['cd533345-f1f3-48c9-a62e-7dc2da50c8f8'],
  })
  @IsOptional()
  @IsArray()
  categoriesIds?: string[]

  @ApiProperty({ nullable: false })
  @IsArray()
  singleItems: CreateSingleItemDto[]
}
