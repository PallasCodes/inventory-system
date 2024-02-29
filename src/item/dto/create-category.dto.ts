import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({ nullable: false, minLength: 1, maxLength: 160 })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name: string

  @ApiProperty({ nullable: true })
  @IsOptional()
  @MinLength(1)
  @MaxLength(500)
  description: string

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsUrl()
  imgUrl: string
}
