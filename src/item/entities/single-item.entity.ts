import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Item, SingleItemStatus } from '.'
import { Borrowing } from 'src/borrowing/entities/borrowing.entity'

@Entity('single_items')
export class SingleItem {
  @ApiProperty()
  @Column({ unique: true, primary: true })
  sku: string

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  comments: string

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  imgUrl: string

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date
}
