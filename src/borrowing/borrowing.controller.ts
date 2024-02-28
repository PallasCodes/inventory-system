import { Controller, Get, Post, Body } from '@nestjs/common'
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

  @Get()
  findAll() {
    return this.borrowingService.findAll()
  }
}
