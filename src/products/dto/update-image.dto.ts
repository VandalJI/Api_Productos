import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsUrl(undefined, { message: 'image_link debe ser URL válida' })
  image_link: string;
}
