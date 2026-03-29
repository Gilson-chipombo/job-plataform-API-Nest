import { Body, Controller, Get, Param, Post, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
    constructor(private comapanies: CompaniesService){}

    @Get()
    getAll(){
        return this.comapanies.findAll();
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('logo', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                if (!file) {
                    cb(null, '');
                    return;
                }
                const timestamp = Date.now();
                cb(null, `${timestamp}-${file.originalname}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file) {
                // Validar apenas imagens
                if (!file.mimetype.startsWith('image/')) {
                    cb(new Error('Arquivo inválido. Envie apenas imagens'), false);
                } else {
                    cb(null, true);
                }
            } else {
                cb(null, true);
            }
        }
    }))
    async create(@Body() body, @UploadedFile() file?: Express.Multer.File){
        if (file) {
            body.logo = file.filename;
        }
        return await this.comapanies.create(body);
    }

    @Get('/amount/vagas/:id')
    getAmountVagas(@Param('id') id: String){
        return this.comapanies.getAmountVagas(+id);
    }

     @Put('reject/:id')
    reject(@Param('id') id: String){
        return this.comapanies.reject(+id);
    }

    @Put('approve/:id')
    approve(@Param('id') id: String){
        return this.comapanies.approve(+id);
    }

    @Post('upload-logo/:id')
    @UseInterceptors(FileInterceptor('logo', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                cb(null, `${timestamp}-${file.originalname}`);
            }
        })
    }))
    async uploadLogo(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
        if (!file) {
            return { message: 'Nenhum arquivo foi enviado' };
        }
        return await this.comapanies.updateLogo(+id, file.filename);
    }
}
