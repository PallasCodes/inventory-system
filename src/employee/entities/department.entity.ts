import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Branch } from './branch.entity'

@Entity('departments')
export class Department {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idDepartment: string

  @ApiProperty()
  @Column('text', { unique: true })
  name: string

  @ManyToOne(() => Branch, (branch) => branch.departments)
  branch: Branch
}
