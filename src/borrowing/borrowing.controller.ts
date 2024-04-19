import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
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

  @Delete(':idBorrowing')
  deleteBorrowing(@Param('idBorrowing') idBorrowing: string) {
    return this.borrowingService.deleteBorrowing(idBorrowing)
  }

  @Post('register-return')
  registerReturn(@Body() borrowingReturnDto: BorrowingReturnDto) {
    return this.borrowingService.registerBorrowingReturn(borrowingReturnDto)
  }

  @Post('cancel/:idBorrowing')
  cancelBorrowing(@Param('idBorrowing') idBorrowing: string) {
    return this.borrowingService.cancelBorrowing(idBorrowing)
  }

  @Get('due-borrowings')
  listDueBorrowings() {
    return this.borrowingService.listDueBorrowings()
  }

  @Get('employee-borrowings-history/:idEmployee')
  getEmployeeBorrowingsHistory(@Param('idEmployee') idEmployee: string) {
    return this.borrowingService.getBorrowingsHistoryByEmployee(idEmployee)
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
