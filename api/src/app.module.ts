import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { CardsModule } from './domains/cards/cards.module';
import { ReviewsModule } from './domains/reviews/reviews.module';

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
    CardsModule,
    ReviewsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
