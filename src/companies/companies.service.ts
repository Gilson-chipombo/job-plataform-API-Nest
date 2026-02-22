import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService){}

    async findAll()
    {
        return this.prisma.company.findMany({
            include: {
                _count: {
                    select: { vagas: true }
                }
            }
        });
    }

    async create(data: any){
        return this.prisma.company.create({ data });
    }

    async findByEmail(email: string)
    {
        console.log("\n\n\n\n\n"+email+"\n\n\n\n\n");
        return this.prisma.company.findUnique({where: {email},
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });
    }
}
