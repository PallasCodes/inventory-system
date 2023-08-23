import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Item } from '.'

enum ItemState {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  FIXING = 'fixing',
  BROKEN = 'broken',
}

@Entity('single-items')
export class SingleItem {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  sku: string
  // TODO: create a real SKU

  @ApiProperty({ nullable: true })
  @Column('text', { nullable: true })
  comments: string

  @ApiProperty()
  @Column({ type: 'enum', enum: ItemState, default: ItemState.AVAILABLE })
  state: ItemState

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
  @ManyToOne(() => Item, (item) => item.singleItems)
  item: Item
}
