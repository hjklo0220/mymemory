export interface CardEntity {
  id: string;
  title: string;
  body: string;
  tag: string;
  source: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
