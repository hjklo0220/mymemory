import { RelationEntity, RelationType, CardWithRelations } from '../entities/relation.entity';

export const RELATIONS_REPOSITORY = 'RELATIONS_REPOSITORY';

export interface IRelationsRepository {
  create(data: { fromCardId: string; toCardId: string; type: RelationType; depth: number }): Promise<RelationEntity>;
  findByCardId(cardId: string): Promise<CardWithRelations[]>;
  delete(id: string): Promise<void>;
  findSimilarByEmbedding(embedding: number[], excludeCardId: string, limit: number): Promise<{ cardId: string; similarity: number }[]>;
  saveEmbedding(cardId: string, embedding: number[]): Promise<void>;
}
