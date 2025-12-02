import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [RatingsModule],
  providers: [AchievementsService],
  controllers: [AchievementsController],
})
export class AchievementsModule {}
