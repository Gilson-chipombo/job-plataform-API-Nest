import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from 'prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { AppliesService } from 'src/applies/applies.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
