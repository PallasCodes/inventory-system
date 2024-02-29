import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Item, SingleItemStatus } from '.'
import { Borrowing } from 'src/borrowing/entities/borrowing.entity'

@Entity('single_items')
export class SingleItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  sku: string
  // TODO: create a real SKU in DB

  @ApiProperty({ nullable: true })
  @Column('text', { nullable: true })
  comments: string

  @ApiProperty({ nullable: true })
  @Column('text', { nullable: true })
  imgUrl: string

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
  @ManyToOne(
    () => SingleItemStatus,
    (singleItemStatus) => singleItemStatus.singleItems,
    { onDelete: 'CASCADE' },
  )
  singleItemStatus: SingleItemStatus

  @ApiProperty()
  @ManyToOne(() => Item, (item) => item, { onDelete: 'CASCADE' })
  item: Item

  @ApiProperty()
  @OneToMany(() => Borrowing, (borrowing) => borrowing.singleItem, {
    onDelete: 'CASCADE',
  })
  borrowings: Borrowing[]
}
