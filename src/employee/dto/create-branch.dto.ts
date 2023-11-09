import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(86)
  name: string
}
