import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppliesService } from './applies.service';

@Controller('applies')
export class AppliesController {
    constructor(private applies: AppliesService){}

    @Get()
    async getAllApplies(){
        return await this.applies.getAllApplies();
    }
    
    @Post('create')
    async createApply(@Body() body){
        return await this.applies.create(body);
    }

    @Get(':id')
    async getApplyById (@Param('id') id: String){
        return await this.applies.getApplyById(+id);
    }

    @Get('/vaga/:id')
    async appliesByVaga(@Param('id') id: String){
        return await this.applies.appliesByVaga(+id);
    }
}
