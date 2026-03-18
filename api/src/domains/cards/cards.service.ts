import { Injectable, NotFoundException } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async findAll(query: { tag?: string; due?: string }): Promise<Card[]> {
    const due = query.due === 'true';
    return this.cardsRepository.findAll({ tag: query.tag, due });
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardsRepository.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
    return card;
  }

  async create(dto: CreateCardDto): Promise<Card> {
    return this.cardsRepository.create({
      title: dto.title,
      body: dto.body,
      tag: dto.tag,
      source: dto.source ?? null,
    });
  }

  async update(id: string, dto: UpdateCardDto): Promise<Card> {
    await this.findOne(id);
    return this.cardsRepository.update(id, dto);
  }

  async remove(id: string): Promise<Card> {
    await this.findOne(id);
    return this.cardsRepository.delete(id);
  }
}
