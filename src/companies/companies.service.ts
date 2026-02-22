import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { AppliesService } from 'src/applies/applies.service';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService ){}

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
        return this.prisma.company.findUnique({where: {email},
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });
    }

    async getAmountVagas(id: number){
        return this.prisma.company.findMany({where: { id },
            select:{
                _count: {
                    select: {vagas: true }
                }
            }
        })
    }
}
