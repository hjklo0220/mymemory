import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { IRelationsRepository } from '../domain/ports/relations.repository.port';
import { RelationEntity, RelationType, CardWithRelations } from '../domain/entities/relation.entity';

@Injectable()
export class PrismaRelationsRepository implements IRelationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { fromCardId: string; toCardId: string; type: RelationType; depth: number }): Promise<RelationEntity> {
    return this.prisma.cardRelation.create({ data }) as unknown as RelationEntity;
  }

  async findByCardId(cardId: string): Promise<CardWithRelations[]> {
    const relations = await this.prisma.cardRelation.findMany({
      where: {
        OR: [{ fromCardId: cardId }, { toCardId: cardId }],
      },
      include: {
        fromCard: { select: { id: true, title: true, tag: true } },
        toCard: { select: { id: true, title: true, tag: true } },
      },
      orderBy: { depth: 'asc' },
    });

    return relations.map((r) => {
      const card = r.fromCardId === cardId ? r.toCard : r.fromCard;
      return {
        id: card.id,
        title: card.title,
        tag: card.tag,
        relationType: r.type as RelationType,
        depth: r.depth,
      };
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cardRelation.delete({ where: { id } });
  }

  async saveEmbedding(cardId: string, embedding: number[]): Promise<void> {
    const vector = `[${embedding.join(',')}]`;
    await this.prisma.$executeRaw`
      UPDATE "Card" SET embedding = ${vector}::vector WHERE id = ${cardId}
    `;
  }

  async findSimilarByEmbedding(embedding: number[], excludeCardId: string, limit: number): Promise<{ cardId: string; similarity: number }[]> {
    const vector = `[${embedding.join(',')}]`;
    const results = await this.prisma.$queryRaw<{ id: string; similarity: number }[]>`
      SELECT id, 1 - (embedding <=> ${vector}::vector) AS similarity
      FROM "Card"
      WHERE id != ${excludeCardId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${limit}
    `;
    return results.map((r) => ({ cardId: r.id, similarity: r.similarity }));
  }
}
