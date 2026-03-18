import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  IReviewsRepository,
  CreateReviewData,
  ReviewEntity,
  SubmitReviewTransactionResult,
} from '../domain/ports/reviews.repository.port';
import { UpdateCardData } from '../../cards/domain/ports/cards.repository.port';
import { CardEntity } from '../../cards/domain/entities/card.entity';

@Injectable()
export class PrismaReviewsRepository implements IReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewData): Promise<ReviewEntity> {
    return this.prisma.review.create({ data });
  }

  async createWithCardUpdate(
    reviewData: CreateReviewData,
    cardUpdateData: UpdateCardData & { id: string },
  ): Promise<SubmitReviewTransactionResult> {
    const { id, ...updateFields } = cardUpdateData;

    const [review, updatedCard] = await this.prisma.$transaction([
      this.prisma.review.create({
        data: {
          cardId: reviewData.cardId,
          rating: reviewData.rating,
        },
      }),
      this.prisma.card.update({
        where: { id },
        data: updateFields,
      }),
    ]);

    return { review, updatedCard };
  }
}
