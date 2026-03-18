import { CardEntity } from '../entities/card.entity';

export interface FindAllOptions {
  tag?: string;
  due?: boolean;
}

export interface CreateCardData {
  title: string;
  body: string;
  tag: string;
  source?: string | null;
}

export interface UpdateCardData {
  title?: string;
  body?: string;
  tag?: string;
  source?: string | null;
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
  nextReviewAt?: Date;
}

export const CARDS_REPOSITORY = 'CARDS_REPOSITORY';

export interface ICardsRepository {
  findAll(options: FindAllOptions): Promise<CardEntity[]>;
  findById(id: string): Promise<CardEntity | null>;
  create(data: CreateCardData): Promise<CardEntity>;
  update(id: string, data: UpdateCardData): Promise<CardEntity>;
  delete(id: string): Promise<CardEntity>;
  findDueToday(): Promise<CardEntity[]>;
}
