import { CardEntity } from '../../../cards/domain/entities/card.entity';
import { UpdateCardData } from '../../../cards/domain/ports/cards.repository.port';

export interface ReviewEntity {
  id: string;
  cardId: string;
  rating: number;
  createdAt: Date;
}

export interface CreateReviewData {
  cardId: string;
  rating: number;
}

export interface SubmitReviewTransactionResult {
  review: ReviewEntity;
  updatedCard: CardEntity;
}

export const REVIEWS_REPOSITORY = 'REVIEWS_REPOSITORY';

export interface IReviewsRepository {
  create(data: CreateReviewData): Promise<ReviewEntity>;
  createWithCardUpdate(
    reviewData: CreateReviewData,
    cardUpdateData: UpdateCardData & { id: string },
  ): Promise<SubmitReviewTransactionResult>;
}
