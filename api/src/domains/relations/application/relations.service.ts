import { Injectable, Inject, Logger } from '@nestjs/common';
import { IRelationsRepository, RELATIONS_REPOSITORY } from '../domain/ports/relations.repository.port';
import { OllamaService } from '../../../core/ollama/ollama.service';
import { CardWithRelations, RelationType } from '../domain/entities/relation.entity';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class RelationsService {
  private readonly logger = new Logger(RelationsService.name);

  constructor(
    @Inject(RELATIONS_REPOSITORY)
    private readonly relationsRepository: IRelationsRepository,
    private readonly ollama: OllamaService,
    private readonly prisma: PrismaService,
  ) {}

  async getRelations(cardId: string): Promise<CardWithRelations[]> {
    return this.relationsRepository.findByCardId(cardId);
  }

  async addRelation(fromCardId: string, toCardId: string, type: RelationType, depth: number) {
    return this.relationsRepository.create({ fromCardId, toCardId, type, depth });
  }

  async removeRelation(relationId: string) {
    return this.relationsRepository.delete(relationId);
  }

  async getSuggestedRelations(cardId: string, limit = 5): Promise<CardWithRelations[]> {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return [];

    const embedding = await this.ollama.embed(`${card.title}\n${card.body}`);
    if (embedding.length === 0) return [];

    const similar = await this.relationsRepository.findSimilarByEmbedding(embedding, cardId, limit);
    const filtered = similar.filter((s) => s.similarity > 0.5);

    const cards = await this.prisma.card.findMany({
      where: { id: { in: filtered.map((s) => s.cardId) } },
      select: { id: true, title: true, tag: true },
    });

    return filtered.map((s) => {
      const c = cards.find((card) => card.id === s.cardId)!;
      return {
        id: s.cardId,
        title: c?.title ?? '',
        tag: c?.tag ?? '',
        relationType: 'related' as RelationType,
        depth: 0,
        similarity: Math.round(s.similarity * 100),
      };
    });
  }

  async generateEmbedding(cardId: string): Promise<void> {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return;

    const embedding = await this.ollama.embed(`${card.title}\n${card.body}`);
    if (embedding.length === 0) {
      this.logger.warn(`카드 ${cardId} 임베딩 생성 실패 (Ollama 미준비)`);
      return;
    }

    await this.relationsRepository.saveEmbedding(cardId, embedding);
    this.logger.log(`카드 ${cardId} 임베딩 저장 완료`);
  }
}
