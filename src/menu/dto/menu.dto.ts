import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty
} from 'class-validator'

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  category: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsBoolean()
  @IsOptional()
  availability?: boolean
}

export class UpdateMenuItemDto extends CreateMenuItemDto {
  @IsOptional()
  name: string

  @IsOptional()
  category: string

  @IsOptional()
  price: number
}
