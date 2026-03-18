import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICardsRepository, CARDS_REPOSITORY } from '../../cards/domain/ports/cards.repository.port';
import {
  IReviewsRepository,
  REVIEWS_REPOSITORY,
  SubmitReviewTransactionResult,
} from '../domain/ports/reviews.repository.port';
import { CardEntity } from '../../cards/domain/entities/card.entity';
import { SubmitReviewDto } from '../presentation/dto/submit-review.dto';
import { calculateSm2 } from '../../../core/algorithms/sm2';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(CARDS_REPOSITORY)
    private readonly cardsRepository: ICardsRepository,
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async getTodayCards(): Promise<CardEntity[]> {
    return this.cardsRepository.findDueToday();
  }

  async submitReview(dto: SubmitReviewDto): Promise<SubmitReviewTransactionResult> {
    const card = await this.cardsRepository.findById(dto.cardId);
    if (!card) {
      throw new NotFoundException(`Card with id ${dto.cardId} not found`);
    }

    const sm2Result = calculateSm2({
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      rating: dto.rating,
    });

    return this.reviewsRepository.createWithCardUpdate(
      { cardId: dto.cardId, rating: dto.rating },
      {
        id: dto.cardId,
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        nextReviewAt: sm2Result.nextReviewAt,
      },
    );
  }
}
