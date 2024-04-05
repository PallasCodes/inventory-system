import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateBorrowingDto {
  @ApiProperty({ nullable: false })
  @IsDateString()
  borrowingDate: string

  @ApiProperty({ nullable: true })
  @IsDateString()
  @IsOptional()
  borrowingDeadline: string

  @ApiProperty({ nullable: true })
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  @IsOptional()
  comments: string

  @ApiProperty()
  @IsUUID('4')
  idEmployee: string

  @ApiProperty()
  @IsString()
  @MinLength(5)
  sku: string
}
