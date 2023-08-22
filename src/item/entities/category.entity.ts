import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Item } from './item.entity'

@Entity('categories')
export class Category {
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
  @ManyToMany(() => Item, (item) => item.categories, { nullable: true })
  items: Item[]
}
