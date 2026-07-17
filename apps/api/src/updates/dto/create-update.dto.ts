import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateUpdateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(4000)
  body!: string;

  // Set by the client to the URL returned by the Blob upload. Restricted to
  // blob.vercel-storage.com so this cannot be used to point the site at
  // arbitrary third-party images.
  @IsOptional()
  @IsUrl({ host_whitelist: [/\.blob\.vercel-storage\.com$/] })
  imageUrl?: string;
}
