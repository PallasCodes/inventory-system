import { Controller, Get } from '@nestjs/common'

import { ItemCatalogsService } from './item-catalogs.service'
import { Auth } from '../auth/decorators'

@Auth()
@Controller('item-catalog')
export class ItemCatalogsController {
  constructor(private readonly itemCatalogsService: ItemCatalogsService) {}

  @Get('single-item-statuses')
  singleItemStatuses() {
    return this.itemCatalogsService.getSingleItemStatuses()
  }
}
