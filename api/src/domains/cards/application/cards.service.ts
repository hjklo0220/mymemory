import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICardsRepository, CARDS_REPOSITORY } from '../domain/ports/cards.repository.port';
import { CardEntity } from '../domain/entities/card.entity';
import { CreateCardDto } from '../presentation/dto/create-card.dto';
import { UpdateCardDto } from '../presentation/dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @Inject(CARDS_REPOSITORY)
    private readonly cardsRepository: ICardsRepository,
  ) {}

  async findAll(query: { tag?: string; due?: string }): Promise<CardEntity[]> {
    const due = query.due === 'true';
    return this.cardsRepository.findAll({ tag: query.tag, due });
  }

  async findOne(id: string): Promise<CardEntity> {
    const card = await this.cardsRepository.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
    return card;
  }

  async create(dto: CreateCardDto): Promise<CardEntity> {
    return this.cardsRepository.create({
      title: dto.title,
      body: dto.body,
      tag: dto.tag,
      source: dto.source ?? null,
    });
  }

  async update(id: string, dto: UpdateCardDto): Promise<CardEntity> {
    await this.findOne(id);
    return this.cardsRepository.update(id, dto);
  }

  async remove(id: string): Promise<CardEntity> {
    await this.findOne(id);
    return this.cardsRepository.delete(id);
  }
}
