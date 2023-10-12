import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { Logger } from '@nestjs/common'

const logger = new Logger('DB Error')

export function handleDBError(error: any): void {
  if (error.code === '23505') throw new BadRequestException(error.detail)

  logger.error(error)

  throw new InternalServerErrorException('Unexpected error, check server logs')
}
