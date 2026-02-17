import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async findAll(){
        return this.prisma.student.findMany();
    }

    async create(data: any){
        return this.prisma.student.create({ data });
    }

    async findOne(id: number){
        return this.prisma.student.findUnique({where: {id}});
    }

    async update(id: number, data: any){
        return this.prisma.student.update({ where: {id}, data});
    }

    async remove(id: number){
        return this.prisma.student.delete({where: {id}})
    }
}
