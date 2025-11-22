import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener máximo 2 decimales' })
  price: number;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  product_key?: string;

  @IsOptional()
  @IsUrl(undefined, { message: 'image_link debe ser URL válida' })
  @MaxLength(200)
  image_link?: string;
}

