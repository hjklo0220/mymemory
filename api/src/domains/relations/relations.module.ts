import { Module } from '@nestjs/common';
import { RelationsController } from './presentation/relations.controller';
import { RelationsService } from './application/relations.service';
import { PrismaRelationsRepository } from './infrastructure/prisma-relations.repository';
import { RELATIONS_REPOSITORY } from './domain/ports/relations.repository.port';

@Module({
  controllers: [RelationsController],
  providers: [
    RelationsService,
    { provide: RELATIONS_REPOSITORY, useClass: PrismaRelationsRepository },
  ],
  exports: [RelationsService],
})
export class RelationsModule {}
