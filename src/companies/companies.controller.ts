import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
    constructor(private comapanies: CompaniesService){}

    @Get()
    getAll(){
        return this.comapanies.findAll();
    }

    @Post('create')
    create(@Body() body){
        return this.comapanies.create(body);
    }
}
