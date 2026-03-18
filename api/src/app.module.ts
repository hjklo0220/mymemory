import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { OllamaModule } from './core/ollama/ollama.module';
import { CardsModule } from './domains/cards/cards.module';
import { ReviewsModule } from './domains/reviews/reviews.module';
import { RelationsModule } from './domains/relations/relations.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    OllamaModule,
    CardsModule,
    ReviewsModule,
    RelationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
