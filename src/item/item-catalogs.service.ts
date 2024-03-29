import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SingleItemStatus } from './entities'
import { CustomResponse } from 'src/utils/CustomResponse'

@Injectable()
export class ItemCatalogsService {
  constructor(
    @InjectRepository(SingleItemStatus)
    private readonly singleItemStatusRepository: Repository<SingleItemStatus>,
  ) {}

  async getSingleItemStatuses() {
    const singleItemStatuses = await this.singleItemStatusRepository.find()
    return new CustomResponse(singleItemStatuses)
  }
}
