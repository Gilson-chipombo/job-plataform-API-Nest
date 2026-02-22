import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VagasService {
    constructor(private prisma: PrismaService){}

    async getAll(){
        return this.prisma.vaga.findMany({
            select: {
                id: true,
                title: true,
                type: true,
                location: true,
                minSalary: true,
                maxSalary: true,
                experience: true,
                description: true,
                responsability: true,
                requirements: true,
                skills: true,
                beneficios: true,
                idCompany: true,
                createdAt: true,
                company: {
                    select:{
                        name: true
                    }
                }
            }
        });
    }

    async create(data: any){
        return this.prisma.vaga.create({ data });
    }

    async findOne(id: number){
        return this.prisma.vaga.findUnique({where: { id },
            select: {
                id: true,
                title: true,
                type: true,
                location: true,
                minSalary: true,
                maxSalary: true,
                experience: true,
                description: true,
                responsability: true,
                requirements: true,
                skills: true,
                beneficios: true,
                idCompany: true,
                company: {
                    select:{
                        name: true,
                        website: true,
                        Province: true,
                        address: true,
                        segment: true,
                        description: true
                    }
                }
            }
        })
    }
}
