import { Expose } from 'class-transformer';

export class ReviewSessionResponseDto {
  @Expose()
  id: string;

  @Expose()
  cardId: string;

  @Expose()
  rating: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedCard: {
    id: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewAt: Date;
  };
}
