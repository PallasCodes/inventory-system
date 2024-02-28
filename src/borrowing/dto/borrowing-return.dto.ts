import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsDateString,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class BorrowingReturnDto {
  @ApiProperty({ nullable: false })
  @IsUUID('4')
  idBorrowing: string

  @ApiProperty({ nullable: false })
  @IsDateString()
  borrowingReturn: string

  @ApiProperty({ nullable: true })
  @IsString()
  @MaxLength(500)
  @MinLength(1)
  @IsOptional()
  comments: string
}
