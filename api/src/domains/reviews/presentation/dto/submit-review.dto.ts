import { IsString, IsNotEmpty, IsInt, IsIn } from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsInt()
  @IsIn([0, 3, 5])
  rating: number;
}
