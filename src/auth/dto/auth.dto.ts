import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum
} from 'class-validator'
import { UserRole } from '../../common/enums/user-role.enum'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string
}

export class RegisterDto extends LoginDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role?: UserRole
}
