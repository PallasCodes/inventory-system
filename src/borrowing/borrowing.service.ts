import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateBorrowingDto } from './dto/create-borrowing.dto'
import { SingleItem, SingleItemStatus } from 'src/item/entities'
import { Employee } from 'src/employee/entities'
import { Borrowing } from './entities/borrowing.entity'
import {
  CustomResponse,
  MessageComponent,
  MessageType,
  ResponseMessage,
} from 'src/utils/CustomResponse'
import { BorrowingReturnDto } from './dto/borrowing-return.dto'

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(SingleItem)
    private readonly singleItemRepository: Repository<SingleItem>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Borrowing)
    private readonly borrowingRepository: Repository<Borrowing>,
    @InjectRepository(SingleItemStatus)
    private readonly singleItemStatusRepository: Repository<SingleItemStatus>,
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto) {
    const singleItem = await this.singleItemRepository.findOneBy({
      sku: createBorrowingDto.sku,
    })
    if (!singleItem) {
      throw new BadRequestException(
        `No single item found with the given ID: ${createBorrowingDto.sku}`,
      )
    }

    const employee = await this.employeeRepository.findOneBy({
      idEmployee: createBorrowingDto.idEmployee,
    })
    if (!employee) {
      throw new BadRequestException(
        `No employee found with the given ID: ${createBorrowingDto.idEmployee}`,
      )
    }

    const borrowing = this.borrowingRepository.create(createBorrowingDto)

    borrowing.employee = employee
    borrowing.singleItem = singleItem
    await this.borrowingRepository.save(borrowing)

    singleItem.singleItemStatus =
      await this.singleItemStatusRepository.findOneBy({
        idSingleItemStatus: 3,
      })
    // TODO: add singleItem catalog
    await this.singleItemRepository.save(singleItem)

    return new CustomResponse(borrowing)
  }

  async registerBorrowingReturn(borrowingReturnDto: BorrowingReturnDto) {
    const borrowing = await this.borrowingRepository.findOneBy({
      idBorrowing: borrowingReturnDto.idBorrowing,
    })

    if (!borrowing) {
      throw new BadRequestException(
        `No borrowing found with the given id: ${borrowingReturnDto.idBorrowing}`,
      )
    }

    borrowing.returnDate = borrowingReturnDto.borrowingReturn
    borrowing.returned = true
    if (borrowingReturnDto.comments)
      borrowing.comments = borrowingReturnDto.comments

    await this.borrowingRepository.save(borrowing)

    return new CustomResponse(borrowing)
  }

  async findAll() {
    const borrowings = await this.borrowingRepository.find({
      order: { borrowingDate: 'DESC' },
      relations: [
        'employee',
        'singleItem',
        'singleItem.item',
        'singleItem.item.categories',
      ],
    })

    return new CustomResponse(borrowings)
  }

  async listDueBorrowings() {
    const borrowings = await this.borrowingRepository.find({
      where: { returned: false },
      order: { borrowingDate: 'DESC' },
      relations: ['employee', 'singleItem', 'singleItem.item'],
    })

    return new CustomResponse(borrowings)
  }

  async getBorrowingsHistory(sku: string) {
    const borrowings = await this.borrowingRepository.find({
      relations: [
        'employee',
        'singleItem',
        'singleItem.item',
        'employee.department',
        'employee.department.branch',
      ],
      where: { singleItem: { sku } },
      order: { borrowingDate: 'ASC' },
    })

    return new CustomResponse(borrowings)
  }

  async cancelBorrowing(idBorrowing: string) {
    const borrowing = await this.borrowingRepository.findOneBy({ idBorrowing })

    if (!borrowing) throw new BadRequestException('No se encontró el prestamo')

    borrowing.returned = false
    borrowing.returnDate = null

    await this.borrowingRepository.save(borrowing)

    return new CustomResponse(
      borrowing,
      new ResponseMessage(
        'Retorno cancelado',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }

  async deleteBorrowing(idBorrowing: string) {
    const borrowing = await this.borrowingRepository.findOneByOrFail({
      idBorrowing,
    })

    await this.borrowingRepository.remove(borrowing)

    return new CustomResponse(
      borrowing,
      new ResponseMessage(
        'Préstamo eliminado correctamente',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }
}
