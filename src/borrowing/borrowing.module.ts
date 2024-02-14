import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BorrowingService } from './borrowing.service'
import { BorrowingController } from './borrowing.controller'
import { AuthModule } from 'src/auth/auth.module'
import { Borrowing } from './entities/borrowing.entity'
import { SingleItem } from 'src/item/entities'
import { Employee } from 'src/employee/entities'

@Module({
  controllers: [BorrowingController],
  providers: [BorrowingService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Borrowing, SingleItem, Employee]),
  ],
})
export class BorrowingModule {}
