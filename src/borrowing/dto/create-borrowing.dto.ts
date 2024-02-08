import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateBorrowingDto {
  @ApiProperty({ nullable: false })
  @IsDate()
  borrowingDate: string

  @ApiProperty({ nullable: true })
  @IsDate()
  @IsOptional()
  borrowingDeadline: string

  @ApiProperty({ nullable: true })
  @IsDate()
  @IsOptional()
  returnDate: string

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
  @IsUUID('4')
  idSingleItem: string
}
