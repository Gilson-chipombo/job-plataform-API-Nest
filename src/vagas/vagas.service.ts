import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VagasService {
    constructor(private prisma: PrismaService){}

    async getAll(){
        return this.prisma.vaga.findMany({
            include:{
                company: {
                    select:{
                        name: true,
                        logo: true
                    }
                },
                _count: {
                    select: {
                        applies: true
                    }
                }
            }
        });
    }

    async create(data: any){
        return this.prisma.vaga.create({ data });
    }

    async findOne(id: number){
        return this.prisma.vaga.findUnique({
            where: { id: id },
            include: {
                company: {
                    select:{
                        name: true,
                        logo: true,
                        website: true,
                        Province: true,
                        address: true,
                        segment: true,
                        description: true
                    }
                }
            }
        });
    }
    // retorna as vagas que a compania publicou e a qtdade de candidaturas
    async vagasByCompany(id: number){
        return this.prisma.vaga.findMany({
            where: {idCompany: id},
            include:{
                _count: {
                    select: {
                      applies: true
                    }
                }
            }
        });
    }
    // Retorna as vagas e os estudantes cadastrados
    async appliesByCompany(id: number){
        return this.prisma.vaga.findMany({ where: {},
            select:{
                applies: {
                    select:{
                        id: true,
                        idVaga: true,
                        idStudent: true,
                        status: true,
                        student: {
                            select:{
                                id: true,
                                fullName: true,
                                areaInterest: true
                            }
                        }
                    },
                },

            }
        });
    }

    async vagasDestaques(){
        return this.prisma.vaga.findMany({ 
            where: { type: "estagio" },
            take: 3,
        });
    }

    async vagasRecentes()
    {
        return this.prisma.vaga.findMany({
            take: 6,
            orderBy:{
                createdAt: 'desc'
            }
        });
    }

    async deleteVaga(id: number){
        return this.prisma.vaga.delete({
            where: { id }
        });
    }

    async updateVaga(id: number, data: any){
        return this.prisma.vaga.update({
            where: { id },
            data: data,
            include: {
                company: {
                    select:{
                        name: true
                    }
                },
                _count: {
                    select: {
                        applies: true
                    }
                }
            }
        });
    }
}
