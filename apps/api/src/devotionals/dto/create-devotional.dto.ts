import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDevotionalDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  reference!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  verseText!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
