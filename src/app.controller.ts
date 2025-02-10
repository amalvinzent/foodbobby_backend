import { Controller, Get } from '@nestjs/common'
import { ResponseDto } from './common/dto/response.dto'

@Controller()
export class AppController {
  @Get()
  getHello(): ResponseDto<string> {
    return new ResponseDto(200, 'Welcome to FoodBobby API', 'Server is running')
  }
}
