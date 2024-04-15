import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { EmployeeService } from './employee.service'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { CreateBranchDto } from './dto/create-branch.dto'
import { Auth } from 'src/auth/decorators'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'

@Auth()
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // BRANCH
  @Post('branch')
  createBranch(@Body() createBranchDto: CreateBranchDto) {
    return this.employeeService.createBranch(createBranchDto)
  }

  @Get('branch')
  findAllBranches() {
    return this.employeeService.findAllBranches()
  }

  @Get('branch/:id')
  findOneBranch(@Param('id') id: string) {
    return this.employeeService.findOneBranch(+id)
  }

  @Delete('branch/:id')
  removeBranch(@Param('id') id: string) {
    return this.employeeService.removeBranch(id)
  }

  // DEPARTMENT
  @Post('department')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.employeeService.createDepartment(createDepartmentDto)
  }

  @Delete('department/:id')
  removeDepartment(@Param('id') id: string) {
    return this.employeeService.removeDepartment(id)
  }

  @Get('department/:id')
  findAllById(@Param('id') id: string) {
    return this.employeeService.findDepartmentsById(id)
  }

  // EMPLOYEE
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto)
  }

  @Get()
  findAll() {
    return this.employeeService.findAll()
  }

  @Get(':idEmployee')
  findOne(@Param('idEmployee') idEmployee: string) {
    return this.employeeService.findOne(idEmployee)
  }

  @Delete(':idEmployee')
  remove(@Param('idEmployee') idEmployee: string) {
    return this.employeeService.remove(idEmployee)
  }

  @Put()
  update(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(updateEmployeeDto)
  }
}
