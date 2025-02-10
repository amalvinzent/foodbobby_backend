import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Delete,
  Param,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { ResponseDto } from '../common/dto/response.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { UserRole } from '../common/enums/user-role.enum'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.authService.register(registerDto)
      return ResponseDto.success(result, 'Registration successful')
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.authService.login(loginDto)
      return ResponseDto.success(result, 'Login successful')
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        error.status || HttpStatus.UNAUTHORIZED
      )
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<ResponseDto<any>> {
    try {
      const users = await this.authService.getAllUsers()
      return ResponseDto.success(users, 'Users retrieved successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve users',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<ResponseDto<any>> {
    try {
      await this.authService.deleteUser(id)
      return ResponseDto.success(null, 'User deleted successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
