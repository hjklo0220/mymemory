import { Module } from '@nestjs/common';
import { ReviewsController } from './presentation/reviews.controller';
import { ReviewsService } from './application/reviews.service';
import { PrismaReviewsRepository } from './infrastructure/prisma-reviews.repository';
import { REVIEWS_REPOSITORY } from './domain/ports/reviews.repository.port';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [CardsModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: REVIEWS_REPOSITORY,
      useClass: PrismaReviewsRepository,
    },
  ],
})
export class ReviewsModule {}
