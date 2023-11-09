import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Department } from './department.entity'

@Entity('branches')
export class Branch {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  idBranch: string

  @Column('text', { unique: true })
  name: string

  @OneToMany(() => Department, (department) => department.branch, {
    cascade: true,
  })
  departments: Department[]
}
