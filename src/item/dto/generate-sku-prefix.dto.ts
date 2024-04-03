import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class GenerateSkuPrefixDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(5)
  skuPrefix: string
}
