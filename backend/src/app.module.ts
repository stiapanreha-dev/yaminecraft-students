import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AchievementsModule } from './achievements/achievements.module';
import { EventsModule } from './events/events.module';
import { RatingsModule } from './ratings/ratings.module';
import { UploadsModule } from './uploads/uploads.module';
import { HomeworkModule } from './homework/homework.module';
import { ProjectsModule } from './projects/projects.module';
import { ArticlesModule } from './articles/articles.module';
import { MaterialsModule } from './materials/materials.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MinioModule,
    AuthModule,
    UsersModule,
    AchievementsModule,
    EventsModule,
    RatingsModule,
    UploadsModule,
    HomeworkModule,
    ProjectsModule,
    ArticlesModule,
    MaterialsModule,
  ],
})
export class AppModule {}
