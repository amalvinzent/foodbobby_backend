import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from '../schemas/user.schema'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { log } from 'console'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.countDocuments({
      username: registerDto.username
    })
    if (existingUser > 0) {
      throw new UnauthorizedException('User already exists')
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const newUser = new this.userModel({
      username: registerDto.username,
      password: hashedPassword,
      role: registerDto.role
    })
    await newUser.save()
    return newUser
  }

  async login(loginDto: LoginDto) {
    const user = (await this.userModel
      .findOne({ username: loginDto.username })
      .select('username password role')
      .lean()) as {
      username: string
      password: string
      role: string
      _id: string
    } | null
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { username: user.username, sub: user._id, role: user.role }
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      access_token: this.jwtService.sign(payload)
    }
  }

  async getAllUsers() {
    const users = await this.userModel.find().select('-password').lean()
    return users
  }

  async deleteUser(id: string) {
    const result = await this.userModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException('User not found')
    }
    return result
  }
}
