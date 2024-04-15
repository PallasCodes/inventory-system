import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Department } from './department.entity'
import { Borrowing } from '../../borrowing/entities/borrowing.entity'

@Entity()
export class Employee {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idEmployee: string

  @ApiProperty()
  @Column('text')
  fullName: string

  @ApiProperty()
  @ManyToOne(() => Department, (department) => department)
  department: Department

  @ApiProperty()
  @OneToMany(() => Borrowing, (borrowing) => borrowing.employee, {
    nullable: true,
  })
  borrowings: Borrowing
}
