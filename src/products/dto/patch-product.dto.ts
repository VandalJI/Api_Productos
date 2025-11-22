import { IsOptional, IsString, MaxLength, IsNumber, IsBoolean, IsUrl } from 'class-validator';

export class PatchProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

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
