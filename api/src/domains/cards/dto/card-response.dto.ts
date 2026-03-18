import { Expose } from 'class-transformer';

export class CardResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  tag: string;

  @Expose()
  source: string | null;

  @Expose()
  easeFactor: number;

  @Expose()
  interval: number;

  @Expose()
  repetitions: number;

  @Expose()
  nextReviewAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
