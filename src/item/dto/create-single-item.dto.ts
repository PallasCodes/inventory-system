import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateSingleItemDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  comments: string

  @ApiProperty({ nullable: false })
  @IsNumber()
  idSingleItemStatus: number
}
