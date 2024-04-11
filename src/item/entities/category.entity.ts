import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Item } from './item.entity'

@Entity('categories')
export class Category {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idCategory: string

  @ApiProperty()
  @Column('text')
  name: string

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string

  @ApiProperty()
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
  @ManyToMany(() => Item, (item) => item.categories, {
    onDelete: 'CASCADE',
  })
  items: Item[]
}
