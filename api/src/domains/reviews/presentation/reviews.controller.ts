import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService } from '../application/reviews.service';
import { SubmitReviewDto } from './dto/submit-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('today')
  getTodayCards() {
    return this.reviewsService.getTodayCards();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitReview(@Body() dto: SubmitReviewDto) {
    const result = await this.reviewsService.submitReview(dto);
    return {
      id: result.review.id,
      cardId: result.review.cardId,
      rating: result.review.rating,
      createdAt: result.review.createdAt,
      updatedCard: {
        id: result.updatedCard.id,
        easeFactor: result.updatedCard.easeFactor,
        interval: result.updatedCard.interval,
        repetitions: result.updatedCard.repetitions,
        nextReviewAt: result.updatedCard.nextReviewAt,
      },
    };
  }
}
