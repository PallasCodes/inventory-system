import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Employee } from 'src/employee/entities/employee.entity'
import { SingleItem } from 'src/item/entities'

@Entity('borrowings')
export class Borrowing {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idBorrowing: string

  @ApiProperty()
  @Column()
  borrowingDate: string

  @ApiProperty()
  @Column({ default: false })
  returned: boolean

  @ApiProperty()
  @Column({ nullable: true })
  borrowingDeadline: string

  @ApiProperty()
  @Column({ nullable: true })
  returnDate: string

  @ApiProperty()
  @Column({ nullable: true })
  comments: string

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.borrowings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  employee: Employee

  @ApiProperty()
  @ManyToOne(() => SingleItem, (singleItem) => singleItem.borrowings, {
    onDelete: 'CASCADE',
  })
  singleItem: SingleItem

  @DeleteDateColumn()
  deletedAt: Date
}
