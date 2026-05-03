import { Module } from '@nestjs/common';
import { AppliesController } from './applies.controller';
import { AppliesService } from './applies.service';
import { PrismaModule } from 'prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AppliesController],
  providers: [AppliesService]
})
export class AppliesModule {}
