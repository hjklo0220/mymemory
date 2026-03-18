import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  body?: string;

  @IsString()
  @IsIn(['linux', 'docker', 'k8s', 'general'])
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
