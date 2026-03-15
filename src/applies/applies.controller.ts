import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
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

    @Get(':id')
    async getApplyById (@Param('id') id: String){
        return await this.applies.getApplyById(+id);
    }

    @Get('/vaga/:id')
    async appliesByVaga(@Param('id') id: String){
        return await this.applies.appliesByVaga(+id);
    }

    @Get('/student/:id')
    getStudentApply(@Param('id') id: String){
      return this.applies.getStudentApply(+id);
    }

    @Delete(':id')
    deleteStudentApply(@Param('id') id: String)
    {
      return this.applies.deleteApply(+id)
    }
}
