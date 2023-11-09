import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { CreateBranchDto } from './dto/create-branch.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Branch, Department } from './entities'
import { Repository } from 'typeorm'
import { CustomResponse } from 'src/utils/CustomResponse'
import { CreateDepartmentDto } from './dto/create-department.dto'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // BRANCH
  async createBranch(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto)
    await this.branchRepository.save(branch)

    return new CustomResponse(branch)
  }

  findAllBranches() {
    return `This action returns all employee`
  }

  findOneBranch(id: number) {
    return `This action returns a #${id} employee`
  }

  // updateBranch(id: number, updateBranchDto: UpdateBranchDto) {
  //   return `This action updates a #${id} employee`
  // }

  async removeBranch(id: string) {
    await this.branchRepository.delete(id)
    return new CustomResponse(null)
    // TODO: add proper return message and handle errors
  }

  // DEPARTMENT
  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const branch = await this.branchRepository.findOneBy({
      idBranch: createDepartmentDto.idBranch,
    })
    if (!branch) {
      throw new BadRequestException(
        `Branch not found with the given ID: ${createDepartmentDto.idBranch}`,
      )
    }

    const department = this.departmentRepository.create(createDepartmentDto)
    department.branch = branch
    await this.departmentRepository.save(department)

    return new CustomResponse(department)
  }

  async removeDepartment(id: string) {
    await this.departmentRepository.delete(id)
    return new CustomResponse(null)
    // TODO: add proper return message and handle errors
  }

  // EMPLOYEE
  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee'
  }

  findAll() {
    return `This action returns all employee`
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`
  }

  // update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  //   return `This action updates a #${id} employee`
  // }

  remove(id: number) {
    return `This action removes a #${id} employee`
  }
}
