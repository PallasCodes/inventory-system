import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { Item, SingleItem } from '../entities'

@EventSubscriber()
export class SingleItemSubscriber
  implements EntitySubscriberInterface<SingleItem>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return SingleItem
  }

  async updateItemCounts(
    event:
      | SoftRemoveEvent<SingleItem>
      | InsertEvent<SingleItem>
      | UpdateEvent<SingleItem>,
  ) {
    if (!event.entity) return

    const itemRepository = event.manager.getRepository(Item)
    const singleItemRepository = event.manager.getRepository(SingleItem)

    const item = await itemRepository.findOne({
      where: { singleItems: { sku: event.entity.sku } },
    })

    if (!item) return

    const totals = await singleItemRepository.count({
      where: { item: { idItem: item.idItem } },
    })

    const query = `SELECT
                    (
                    SELECT COUNT
                      ( si."singleItemStatusIdSingleItemStatus" ) 
                    FROM
                      items i
                      LEFT JOIN single_items si ON i."idItem" = si."itemIdItem"
                      LEFT JOIN single_item_status sis ON sis."idSingleItemStatus" = si."singleItemStatusIdSingleItemStatus" 
                    WHERE
                      sis."idSingleItemStatus" = 1 
                      AND i."idItem" = ii."idItem" 
                    ) AS available,
                    (
                    SELECT COUNT
                      ( si."singleItemStatusIdSingleItemStatus" ) 
                    FROM
                      items i
                      LEFT JOIN single_items si ON i."idItem" = si."itemIdItem"
                      LEFT JOIN single_item_status sis ON sis."idSingleItemStatus" = si."singleItemStatusIdSingleItemStatus" 
                    WHERE
                      sis."idSingleItemStatus" = 2 
                      AND i."idItem" = ii."idItem" 
                    ) AS not_available,
                    (
                    SELECT COUNT
                      ( si."singleItemStatusIdSingleItemStatus" ) 
                    FROM
                      items i
                      LEFT JOIN single_items si ON i."idItem" = si."itemIdItem"
                      LEFT JOIN single_item_status sis ON sis."idSingleItemStatus" = si."singleItemStatusIdSingleItemStatus" 
                    WHERE
                      sis."idSingleItemStatus" = 3 
                      AND i."idItem" = ii."idItem" 
                    ) AS borrowed,
                    (
                    SELECT COUNT
                      ( si."singleItemStatusIdSingleItemStatus" ) 
                    FROM
                      items i
                      LEFT JOIN single_items si ON i."idItem" = si."itemIdItem"
                      LEFT JOIN single_item_status sis ON sis."idSingleItemStatus" = si."singleItemStatusIdSingleItemStatus" 
                    WHERE
                      sis."idSingleItemStatus" = 4 
                      AND i."idItem" = ii."idItem" 
                    ) AS fixing 
                  FROM
                    items ii
                  WHERE ii."idItem" = '${item.idItem}'`

    const [results] = await itemRepository.query(query)

    item.numAvailableItems = results.available
    item.numBorrowedItems = results.borrowed
    item.numFixingItems = results.fixing
    item.numUnavailableItems = results.not_available
    item.numTotalItems = totals

    await itemRepository.save(item)
  }

  async beforeSoftRemove(event: SoftRemoveEvent<SingleItem>) {
    await this.updateItemCounts(event)

    const itemRepository = event.manager.getRepository(Item)
    const singleItemRepository = event.manager.getRepository(SingleItem)

    const item = await itemRepository.findOne({
      where: { singleItems: { sku: event.entity.sku } },
    })

    item.numTotalItems -= 1

    const { singleItemStatus } = await singleItemRepository.findOne({
      where: { sku: event.entity.sku },
      loadRelationIds: true,
    })

    switch (singleItemStatus as unknown as number) {
      case 1:
        item.numAvailableItems -= 1
        break
      case 2:
        item.numUnavailableItems -= 1
        break
      case 3:
        item.numBorrowedItems -= 1
        break
      case 4:
        item.numFixingItems -= 1
        break
    }

    itemRepository.save(item)
  }

  async afterInsert(event: InsertEvent<SingleItem>) {
    await this.updateItemCounts(event)
  }

  async afterUpdate(event: UpdateEvent<SingleItem>) {
    await this.updateItemCounts(event)
  }
}
