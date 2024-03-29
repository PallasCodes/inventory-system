import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { BorrowingService } from './borrowing.service'
import { CreateBorrowingDto } from './dto/create-borrowing.dto'
import { BorrowingReturnDto } from './dto/borrowing-return.dto'

@Controller('borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  create(@Body() createBorrowingDto: CreateBorrowingDto) {
    return this.borrowingService.create(createBorrowingDto)
  }

  @Post('register-return')
  registerReturn(@Body() borrowingReturnDto: BorrowingReturnDto) {
    return this.borrowingService.registerBorrowingReturn(borrowingReturnDto)
  }
  @Get('due-borrowings')
  listDueBorrowings() {
    return this.borrowingService.listDueBorrowings()
  }

  @Get('borrowings-history/:sku')
  getBorrowingsHistory(@Param('sku') sku: string) {
    return this.borrowingService.getBorrowingsHistory(sku)
  }

  @Get()
  findAll() {
    return this.borrowingService.findAll()
  }
}
