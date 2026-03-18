import { Module } from '@nestjs/common';
import { CardsController } from './presentation/cards.controller';
import { CardsService } from './application/cards.service';
import { PrismaCardsRepository } from './infrastructure/prisma-cards.repository';
import { CARDS_REPOSITORY } from './domain/ports/cards.repository.port';

@Module({
  controllers: [CardsController],
  providers: [
    CardsService,
    {
      provide: CARDS_REPOSITORY,
      useClass: PrismaCardsRepository,
    },
  ],
  exports: [CardsService, CARDS_REPOSITORY],
})
export class CardsModule {}
