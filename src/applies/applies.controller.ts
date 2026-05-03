import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, Delete, Put } from '@nestjs/common';
import { AppliesService } from './applies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('applies')
export class AppliesController {
    constructor(private applies: AppliesService){}

    @Get()
    async getAllApplies(){
        return await this.applies.getAllApplies();
    }
    
    @Post('create')
    @UseInterceptors(FileInterceptor('cv', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + file.originalname;
          callback(null, unique);
        }
      })
    }))
    async createApply(
      @Body() data: any,
      @UploadedFile() file?: Express.Multer.File
    ) {

      const cvPath = file ? file.filename : null;

      return this.applies.create(data, cvPath);
    }

    @Get('/vaga/:id')
    async appliesByVaga(@Param('id') id: String){
        return await this.applies.appliesByVaga(+id);
    }

    @Get('/student/:id')
    getStudentApply(@Param('id') id: String){
      return this.applies.getStudentApply(+id);
    }

    @Get(':id')
    async getApplyById (@Param('id') id: String){
        return await this.applies.getApplyById(+id);
    }

    @Delete(':id')
    deleteStudentApply(@Param('id') id: String)
    {
      return this.applies.deleteApply(+id)
    }

    @Put(':id/approve')
    async approveApplication(@Param('id') id: string) {
      return await this.applies.approveApplication(+id);
    }

    @Put(':id/reject')
    async rejectApplication(@Param('id') id: string, @Body() body?: { reason?: string }) {
      return await this.applies.rejectApplication(+id, body?.reason);
    }
}
