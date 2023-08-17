import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from './category.entity'

@Entity('items')
export class Item {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column('text')
  name: string

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string

  @ApiProperty()
  @Column('int')
  amount: number

  @ApiProperty()
  @Column('boolean', { default: true })
  available: boolean

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
  @ManyToOne(() => Category, (category) => category.items, { nullable: true })
  category: Category

  // add calculated columns for borrowed and available amounts
}
