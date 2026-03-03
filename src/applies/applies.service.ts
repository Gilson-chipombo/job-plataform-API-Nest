import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppliesService {
    constructor(private prisma: PrismaService){}
    
    getAllApplies(){ return this.prisma.apply.findMany(); }
    
    async create(data: any)
    {         
        const alreadyApplied = await this.prisma.apply.findFirst({where: {
            AND: [
                { idStudent: data.idStudent },
                { idVaga: data.idVaga }
             ]     
            }
        });

        if (alreadyApplied) return { "message": "Já fizeste uma candidatura nesta vaga." };
        else
            return await this.prisma.apply.create({ data }); 
    }

    getApplyById(id: number){ return this.prisma.apply.findUnique({ where: { id } }); }

    //Candidaturas por empresa


    //Studantes que aplicaram para uma vaga
    async appliesByVaga(id: number){
        return this.prisma.apply.findMany({where: { idVaga: id },
            select: {
                idVaga: true,
                idStudent: true,
                status: true,
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
    }


}
