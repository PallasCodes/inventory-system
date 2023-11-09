import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmployeeService } from './employee.service'
import { EmployeeController } from './employee.controller'
import { AuthModule } from '../auth/auth.module'
import { Branch, Department, Employee } from './entities'

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Employee, Branch, Department]),
  ],
})
export class EmployeeModule {}
