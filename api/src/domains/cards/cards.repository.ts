import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { Card, Prisma } from '@prisma/client';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { tag?: string; due?: boolean }): Promise<Card[]> {
    const where: Prisma.CardWhereInput = {};

    if (params.tag) {
      where.tag = params.tag;
    }

    if (params.due) {
      where.nextReviewAt = { lte: new Date() };
    }

    return this.prisma.card.findMany({
      where,
      orderBy: { nextReviewAt: 'asc' },
    });
  }

  async findById(id: string): Promise<Card | null> {
    return this.prisma.card.findUnique({ where: { id } });
  }

  async create(data: Prisma.CardCreateInput): Promise<Card> {
    return this.prisma.card.create({ data });
  }

  async update(id: string, data: Prisma.CardUpdateInput): Promise<Card> {
    return this.prisma.card.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Card> {
    return this.prisma.card.delete({ where: { id } });
  }

  async findDueToday(): Promise<Card[]> {
    return this.prisma.card.findMany({
      where: { nextReviewAt: { lte: new Date() } },
      orderBy: { nextReviewAt: 'asc' },
    });
  }
}
