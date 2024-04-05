import { ApiProperty } from '@nestjs/swagger'
import {
  AfterUpdate,
  Column,
  CreateDateColumn,
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
  @Column('text')
  name: string

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string

  @ApiProperty()
  @Column('int')
  numTotalItems: number

  @ApiProperty()
  @Column('int')
  numAvailableItems: number

  @ApiProperty()
  @Column('int')
  numBorrowedItems: number

  @ApiProperty()
  @Column('text', { unique: true })
  skuPrefix: string

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date

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

  // TODO: add calculated columns for borrowed and available amounts
}
