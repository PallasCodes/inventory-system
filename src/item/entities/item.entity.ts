import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from './category.entity'
import { SingleItem } from './single-item.entity'

@Entity('items')
export class Item {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idItem: string

  @ApiProperty()
  @Column()
  name: string

  @ApiProperty()
  @Column({ nullable: true })
  description: string

  @ApiProperty()
  @Column()
  numTotalItems: number

  @ApiProperty()
  @Column()
  numAvailableItems: number

  @ApiProperty()
  @Column({ default: 0 })
  numBorrowedItems: number

  @ApiProperty()
  @Column({ default: 0 })
  numUnavailableItems: number

  @ApiProperty()
  @Column({ default: 0 })
  numFixingItems: number

  @ApiProperty()
  @Column({ unique: true })
  skuPrefix: string

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date

  @ApiProperty()
  @ManyToMany(() => Category, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: Category[]

  @ApiProperty()
  @OneToMany(() => SingleItem, (singleItem) => singleItem.item, {
    onDelete: 'CASCADE',
  })
  singleItems: SingleItem[]

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date
}
