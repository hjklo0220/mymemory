import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RelationsService } from '../application/relations.service';
import { CreateRelationDto } from './dto/create-relation.dto';

@Controller('cards/:cardId/relations')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @Get()
  getRelations(@Param('cardId') cardId: string) {
    return this.relationsService.getRelations(cardId);
  }

  @Get('suggestions')
  getSuggestions(@Param('cardId') cardId: string) {
    return this.relationsService.getSuggestedRelations(cardId);
  }

  @Post()
  addRelation(@Param('cardId') cardId: string, @Body() dto: CreateRelationDto) {
    return this.relationsService.addRelation(cardId, dto.toCardId, dto.type, dto.depth);
  }

  @Delete(':relationId')
  removeRelation(@Param('relationId') relationId: string) {
    return this.relationsService.removeRelation(relationId);
  }
}
