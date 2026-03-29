import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppliesService {
    constructor(private prisma: PrismaService){}
    
    getAllApplies(){ return this.prisma.apply.findMany(); }
    
    async create(data: any, cvPath: string | null)
    {         
        // Validar se a vaga ainda aceita candidaturas
        const vaga = await this.prisma.vaga.findUnique({
            where: { id: Number(data.idVaga) }
        }) as any;

        if (!vaga) {
            throw new BadRequestException('Vaga não encontrada');
        }

        if (vaga.applicationDeadline && new Date() > vaga.applicationDeadline) {
            throw new BadRequestException('O prazo para candidaturas nesta vaga expirou');
        }

        // Validar se já candidatou
        const alreadyApplied = await this.prisma.apply.findFirst({
            where: {
                idStudent: Number(data.idStudent),
                idVaga: Number(data.idVaga)
            }
        });

        if (alreadyApplied) {
            return { message: "Já fizeste uma candidatura nesta vaga." };
        }

        return await this.prisma.apply.create({
            data: {
                idStudent: Number(data.idStudent),
                idVaga: Number(data.idVaga),
                description: data.description,
                cvPath: cvPath
            }
        });
    }

    getApplyById(id: number){ return this.prisma.apply.findUnique({ where: { id } }); }

    //Candidaturas por empresa


    deleteApply(id: number){
        return this.prisma.apply.delete({where: {id} });
    }
 

    async getStudentApply(id: number) {
        return await this.prisma.apply.findMany({
            where: {idStudent: id },
            include: {
                vaga: true
                }
        });

        
    }

    //Studantes que aplicaram para uma vaga
    async appliesByVaga(id: number){
        const applies = await this.prisma.apply.findMany({where: { idVaga: id },
            select: {
                idVaga: true,
                idStudent: true,
                status: true,
                cvPath: true,
                student: {
                    select:{
                        fullName: true,
                        email: true,
                        telphone: true,
                        school: true,
                        areaInterest: true,
                        skills: true,
                    }
                }
            }
        });

        return applies.map(apply => ({
        ...apply,
        cvUrl: apply.cvPath
            ? `http://127.0.0.1:3000/uploads/cv/${apply.cvPath}`
            : null
        }));
    }

}
