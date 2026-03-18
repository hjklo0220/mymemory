import { Injectable, Inject, NotFoundException, Optional } from '@nestjs/common';
import { ICardsRepository, CARDS_REPOSITORY } from '../domain/ports/cards.repository.port';
import { CardEntity } from '../domain/entities/card.entity';
import { CreateCardDto } from '../presentation/dto/create-card.dto';
import { UpdateCardDto } from '../presentation/dto/update-card.dto';
import { RelationsService } from '../../relations/application/relations.service';

@Injectable()
export class CardsService {
  constructor(
    @Inject(CARDS_REPOSITORY)
    private readonly cardsRepository: ICardsRepository,
    @Optional()
    private readonly relationsService?: RelationsService,
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
    const card = await this.cardsRepository.create({
      title: dto.title,
      body: dto.body,
      tag: dto.tag,
      source: dto.source ?? null,
    });
    // 임베딩 생성은 비동기로 처리 (응답 속도 영향 없음)
    this.relationsService?.generateEmbedding(card.id).catch(() => null);
    return card;
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
