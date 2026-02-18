import { Body, Controller, Get, Post } from '@nestjs/common';
import { VagasService } from './vagas.service';

@Controller('vagas')
export class VagasController {
    constructor(private vagas: VagasService){}

    @Get()
    getAll() { return this.vagas.getAll(); }

    @Post('create')
    create(@Body() body){ return this.vagas.create(body); }

}
