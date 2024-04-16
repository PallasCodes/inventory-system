import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { Borrowing } from '../entities/borrowing.entity'
import { Employee } from 'src/employee/entities'

@EventSubscriber()
export class BorrowingSubscriber
  implements EntitySubscriberInterface<Borrowing>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Borrowing
  }

  async updateNumBorrowingsCount(
    event: InsertEvent<Borrowing> | UpdateEvent<Borrowing>,
  ) {
    const employeeRepository = event.manager.getRepository(Employee)
    const borrowingRepository = event.manager.getRepository(Borrowing)

    const employee = await employeeRepository.findOneOrFail({
      where: { borrowings: { idBorrowing: event.entity.idBorrowing } },
    })

    const numBorrowings = await borrowingRepository.count({
      where: { employee: { idEmployee: employee.idEmployee } },
    })

    employee.numBorrowings = numBorrowings

    await event.manager.getRepository(Employee).save(employee)
  }

  async beforeSoftRemove(event: SoftRemoveEvent<Borrowing>) {
    const employeeRepository = event.manager.getRepository(Employee)

    const employee = await employeeRepository.findOneOrFail({
      where: { borrowings: { idBorrowing: event.entity.idBorrowing } },
    })

    employee.numBorrowings -= 1

    await employeeRepository.save(employee)
  }

  async afterInsert(event: InsertEvent<Borrowing>) {
    await this.updateNumBorrowingsCount(event)
  }

  async afterUpdate(event: UpdateEvent<Borrowing>) {
    await this.updateNumBorrowingsCount(event)
  }
}
