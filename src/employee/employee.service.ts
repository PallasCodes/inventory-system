import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { CreateBranchDto } from './dto/create-branch.dto'
import { Branch, Department, Employee } from './entities'
import {
  CustomResponse,
  MessageComponent,
  MessageType,
  ResponseMessage,
} from 'src/utils/CustomResponse'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // BRANCH
  async createBranch(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto)
    await this.branchRepository.save(branch)

    return new CustomResponse(branch)
  }

  async findAllBranches() {
    const branches = await this.branchRepository.find({
      order: {
        name: 'ASC',
      },
    })

    return new CustomResponse(branches)
  }

  findOneBranch(id: number) {
    return `This action returns a #${id} employee`
  }

  async removeBranch(id: string) {
    await this.branchRepository.delete(id)
    return new CustomResponse(null)
    // TODO: add a proper return message and handle errors
  }

  // DEPARTMENT
  async findDepartmentsById(branch: string) {
    const departments =
      (await this.departmentRepository.findBy({
        branch: { idBranch: branch },
      })) || []

    return new CustomResponse(departments)
  }

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(createDepartmentDto)
    await this.departmentRepository.save(department)

    return new CustomResponse(department)
  }

  async removeDepartment(id: string) {
    await this.departmentRepository.delete(id)

    return new CustomResponse(null)
    // TODO: add a proper return message and handle error
  }

  // EMPLOYEE
  async create(createEmployeeDto: CreateEmployeeDto) {
    const department = await this.departmentRepository.findOneBy({
      idDepartment: createEmployeeDto.idDepartment,
    })
    if (!department) {
      throw new BadRequestException(
        `Department with the given ID not found: ${createEmployeeDto.idDepartment}`,
      )
    }

    const employee = this.employeeRepository.create(createEmployeeDto)
    employee.department = department
    await this.employeeRepository.save(employee)

    return new CustomResponse(
      employee,
      new ResponseMessage(
        'Empleado registrado correctamente',
        MessageComponent.TOAST,
        MessageType.SUCCESS,
      ),
    )
  }

  async findAll() {
    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.department', 'department')
      .innerJoinAndSelect('department.branch', 'branch')
      .select([
        'employee.fullName as full_name',
        'department.name as department',
        'branch.name as branch',
        'employee.idEmployee as id_employee',
        'branch.idBranch as id_branch',
        'department.idDepartment as id_department',
        'employee.numBorrowings as num_borrowings',
      ])
      .getRawMany()

    return new CustomResponse(employees)
  }

  async findOne(idEmployee: string) {
    const employee = await this.employeeRepository.findOne({
      where: { idEmployee },
      relations: ['department', 'department.branch'],
    })

    return new CustomResponse(employee)
  }

  async remove(idEmployee: string) {
    const employee = await this.employeeRepository.findOneByOrFail({
      idEmployee,
    })

    await this.employeeRepository.softRemove(employee)

    return new CustomResponse(
      employee,
      new ResponseMessage('Empleado eliminado correctamente'),
    )
  }

  async updateEmployee(updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOneByOrFail({
      idEmployee: updateEmployeeDto.idEmployee,
    })

    if (updateEmployeeDto.idDepartment) {
      const department = await this.departmentRepository.findOneByOrFail({
        idDepartment: updateEmployeeDto.idDepartment,
      })

      updateEmployeeDto.department = department

      delete updateEmployeeDto.idDepartment
    }

    await this.employeeRepository.update(employee.idEmployee, updateEmployeeDto)

    return new CustomResponse(
      { message: 'Employee updated succesfully' },
      new ResponseMessage('Empleado editado correctamente'),
    )
  }
}
