import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateBorrowingDto } from './dto/create-borrowing.dto'
import { UpdateBorrowingDto } from './dto/update-borrowing.dto'
import { SingleItem } from 'src/item/entities'
import { Employee } from 'src/employee/entities'
import { Borrowing } from './entities/borrowing.entity'
import { CustomResponse } from 'src/utils/CustomResponse'

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(SingleItem)
    private readonly singleItemRepository: Repository<SingleItem>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Borrowing)
    private readonly borrowingRepository: Repository<Borrowing>,
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto) {
    const singleItem = await this.singleItemRepository.findOneBy({
      sku: createBorrowingDto.idSingleItem,
    })

    if (!singleItem) {
      throw new BadRequestException(
        `No single item found with the given ID: ${createBorrowingDto.idSingleItem}`,
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

    return new CustomResponse(borrowing)
  }

  async findAll() {
    const borrowings = await this.borrowingRepository.find({
      order: { borrowingDate: 'DESC' },
      relations: ['employee', 'singleItem', 'singleItem.item'],
    })

    return new CustomResponse(borrowings)
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowing`
  }

  update(id: number, updateBorrowingDto: UpdateBorrowingDto) {
    return `This action updates a #${id} borrowing`
  }

  remove(id: number) {
    return `This action removes a #${id} borrowing`
  }
}
