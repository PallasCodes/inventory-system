import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateEmployeeDto } from './create-employee.dto'
import { IsUUID } from 'class-validator'
import { Department } from '../entities'

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiProperty()
  @IsUUID('4')
  idEmployee: string

  department?: Department
}
