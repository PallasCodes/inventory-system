import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SingleItem } from '.'

@Entity()
export class SingleItemStatus {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  idSingleItemStatus: number

  @ApiProperty()
  @Column()
  name: string

  @ApiProperty()
  @OneToMany(() => SingleItem, (singleItem) => singleItem.singleItemStatus, {
    onDelete: 'CASCADE',
  })
  singleItems: SingleItem[]
}
