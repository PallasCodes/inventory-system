import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @Column()
  name: string

  @ApiProperty()
  @Column({ nullable: true })
  description: string

  @ApiProperty()
  @Column({ nullable: true })
  imgUrl: string

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date

  @ApiProperty()
  @ManyToMany(() => Item, (item) => item.categories, {
    onDelete: 'CASCADE',
  })
  items: Item[]

  @DeleteDateColumn()
  deletedAt: Date
}
