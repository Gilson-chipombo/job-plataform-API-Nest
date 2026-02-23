import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VagasService } from './vagas.service';

@Controller('vagas')
export class VagasController {
    constructor(private vagas: VagasService){}

    @Get()
    getAll() { return this.vagas.getAll(); }

    @Post('create')
    create(@Body() body){ return this.vagas.create(body); }

    @Get(':id')
    findOne(@Param('id') id: String){ return this.vagas.findOne(+id); }

    @Get('/company/:id')
    async vagasByCompany(@Param('id') id: String){
        return await this.vagas.vagasByCompany(+id);
    }

    @Get('/company/applies/:id')
    appliesByCompany(@Param('id') id: String){
        return this.vagas.appliesByCompany(+id);
    }

}
