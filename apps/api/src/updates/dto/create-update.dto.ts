import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUpdateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(4000)
  body!: string;
}
