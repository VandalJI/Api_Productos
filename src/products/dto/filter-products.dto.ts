import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  is_deleted?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumberString()
  min_price?: string;

  @IsOptional()
  @IsNumberString()
  max_price?: string;

  @IsOptional()
  @IsString()
  q?: string;
}
