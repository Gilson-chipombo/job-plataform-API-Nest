import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VagasService {
    constructor(private prisma: PrismaService){}

    async getAll(){
        return this.prisma.vaga.findMany();
    }

    async create(data: any){
        return this.prisma.vaga.create({ data });
    }
}
