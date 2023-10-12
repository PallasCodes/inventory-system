import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpStatus } from '@nestjs/common'

import { ItemService } from '../src/item/item.service'
import {
  Category,
  Item,
  SingleItem,
  SingleItemStatus,
} from '../src/item/entities'
import { ItemModule } from '../src/item/item.module'
import { ConfigModule } from '@nestjs/config'
import { CustomResponse } from '../src/utils/CustomResponse'
import { AuthModule } from '../src/auth/auth.module'
import { User } from '../src/auth/entities/user.entity'
import { AuthService } from '../src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'

describe('Items', () => {
  let app: INestApplication
  let itemService: ItemService
  let authService: AuthService
  const jwtService = new JwtService()
  let itemRepository: Repository<Item>
  let categoryRepository: Repository<Category>
  let singleItemRepository: Repository<SingleItem>
  let singleItemStatusRepository: Repository<SingleItemStatus>
  let userRepository: Repository<User>

  let token
  const user = {
    username: 'user',
    email: 'email@gmail.com',
    password: 'passwordA123',
  }

  const customResponse = new CustomResponse([])

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ItemModule,
        AuthModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT_TEST,
          database: process.env.DB_NAME_TEST,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    itemRepository = moduleFixture.get('ItemRepository')
    categoryRepository = moduleFixture.get('CategoryRepository')
    singleItemRepository = moduleFixture.get('SingleItemRepository')
    singleItemStatusRepository = moduleFixture.get('SingleItemStatusRepository')
    userRepository = moduleFixture.get('UserRepository')
    itemService = new ItemService(
      itemRepository,
      categoryRepository,
      singleItemRepository,
      singleItemStatusRepository,
    )
    authService = new AuthService(userRepository, jwtService)

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)

    token = response.body.token
  })

  afterAll(async () => {
    await singleItemStatusRepository.query('DELETE FROM single_item_status')
    await userRepository.query('DELETE FROM users')
    await singleItemRepository.query('DELETE FROM single_item')
    await itemRepository.query('DELETE FROM item')
    await categoryRepository.query('DELETE FROM category')
    await app.close()
  })

  it('[GET] /item : it should return all items in DB', async () => {
    const response = await request(app.getHttpServer())
      .get('/item')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.body).toMatchObject(customResponse)
  })
})
