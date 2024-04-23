import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Employee } from './employee.entity'
import { Branch } from './branch.entity'

@Entity('departments')
export class Department {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idDepartment: string

  @ApiProperty()
  @Column({ unique: true })
  name: string

  @ApiProperty()
  @OneToMany(() => Employee, (employee) => employee.department, {
    onDelete: 'CASCADE',
  })
  employees: Employee[]

  @ApiProperty()
  @ManyToOne(() => Branch, (branch) => branch.departments, {
    onDelete: 'CASCADE',
  })
  branch: Branch
}
