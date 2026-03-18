export type RelationType = 'related' | 'deepdive';

export interface RelationEntity {
  id: string;
  fromCardId: string;
  toCardId: string;
  type: RelationType;
  depth: number;
  createdAt: Date;
}

export interface CardWithRelations {
  id: string;
  title: string;
  tag: string;
  relationType: RelationType;
  depth: number;
  similarity?: number;
}
