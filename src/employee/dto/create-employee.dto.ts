import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class CreateEmployeeDto {
  @ApiProperty({ nullable: false, minLength: 1, maxLength: 160 })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  fullName: string

  @ApiProperty({ nullable: false, minLength: 1, maxLength: 160 })
  @IsUUID()
  idDepartment: string
}
