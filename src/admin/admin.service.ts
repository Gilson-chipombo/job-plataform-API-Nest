import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService){}
    
    async findAll()
    {
        return this.prisma.admin.findMany();
    }

    async create(data: any){
        return this.prisma.admin.create({ data });
    }

    async findByEmail(email: string)
    {
        return this.prisma.admin.findUnique({where: {email},
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });
    }
}
