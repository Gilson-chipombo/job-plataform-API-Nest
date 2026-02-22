import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { VagasModule } from './vagas/vagas.module';
import { AppliesModule } from './applies/applies.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, VagasModule, AppliesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
