import { IsString, IsIn, IsInt, Min } from 'class-validator';

export class CreateRelationDto {
  @IsString()
  toCardId: string;

  @IsIn(['related', 'deepdive'])
  type: 'related' | 'deepdive';

  @IsInt()
  @Min(0)
  depth: number;
}
