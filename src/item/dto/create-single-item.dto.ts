import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateSingleItemDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(500)
  comments: string

  @ApiProperty({ nullable: false })
  @IsNumber()
  idSingleItemStatus: number

  @ApiProperty({ nullable: false })
  @IsUrl()
  imgUrl: string
}
