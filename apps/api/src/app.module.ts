import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AuthModule } from './auth/auth.module';
import { UpdatesModule } from './updates/updates.module';
import { DevotionalsModule } from './devotionals/devotionals.module';
import { UploadsModule } from './uploads/uploads.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FeedbackModule,
    AuthModule,
    UpdatesModule,
    DevotionalsModule,
    UploadsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
