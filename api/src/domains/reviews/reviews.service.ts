import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CardsRepository } from '../cards/cards.repository';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { calculateSm2 } from '../../core/algorithms/sm2';
import { Card, Review } from '@prisma/client';

export interface ReviewResult {
  review: Review;
  updatedCard: Card;
}

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardsRepository: CardsRepository,
  ) {}

  async getTodayCards(): Promise<Card[]> {
    return this.cardsRepository.findDueToday();
  }

  async submitReview(dto: SubmitReviewDto): Promise<ReviewResult> {
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

    const [review, updatedCard] = await this.prisma.$transaction([
      this.prisma.review.create({
        data: {
          cardId: dto.cardId,
          rating: dto.rating,
        },
      }),
      this.prisma.card.update({
        where: { id: dto.cardId },
        data: {
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          nextReviewAt: sm2Result.nextReviewAt,
        },
      }),
    ]);

    return { review, updatedCard };
  }
}
