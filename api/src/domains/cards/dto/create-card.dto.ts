import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsIn(['linux', 'docker', 'k8s', 'general'])
  tag: string;

  @IsString()
  @IsOptional()
  source?: string;
}
