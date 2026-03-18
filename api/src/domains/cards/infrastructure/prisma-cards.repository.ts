import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { Prisma } from '@prisma/client';
import {
  ICardsRepository,
  FindAllOptions,
  CreateCardData,
  UpdateCardData,
} from '../domain/ports/cards.repository.port';
import { CardEntity } from '../domain/entities/card.entity';

@Injectable()
export class PrismaCardsRepository implements ICardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindAllOptions): Promise<CardEntity[]> {
    const where: Prisma.CardWhereInput = {};

    if (options.tag) {
      where.tag = options.tag;
    }

    if (options.due) {
      where.nextReviewAt = { lte: new Date() };
    }

    return this.prisma.card.findMany({
      where,
      orderBy: { nextReviewAt: 'asc' },
    });
  }

  async findById(id: string): Promise<CardEntity | null> {
    return this.prisma.card.findUnique({ where: { id } });
  }

  async create(data: CreateCardData): Promise<CardEntity> {
    return this.prisma.card.create({ data });
  }

  async update(id: string, data: UpdateCardData): Promise<CardEntity> {
    return this.prisma.card.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CardEntity> {
    return this.prisma.card.delete({ where: { id } });
  }

  async findDueToday(): Promise<CardEntity[]> {
    return this.prisma.card.findMany({
      where: { nextReviewAt: { lte: new Date() } },
      orderBy: { nextReviewAt: 'asc' },
    });
  }
}
