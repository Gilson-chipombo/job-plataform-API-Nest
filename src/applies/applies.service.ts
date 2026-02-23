import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppliesService {
    constructor(private prisma: PrismaService){}
    
    getAllApplies(){ return this.prisma.apply.findMany(); }
    
    create(data: any){ 
        //Tenho que validar se o estudante e a vaga existem antes de criar a aplicação
        //Tenho que validar se o estudante já aplicou para a vaga antes de criar a aplicação
        //Tenho que validar se o estudante já tem uma aplicação para a vaga em andamento antes de criar a aplicação
        return this.prisma.apply.create({ data }); 
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
