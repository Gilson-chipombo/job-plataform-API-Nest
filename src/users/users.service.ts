import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async findAll(){
        return this.prisma.student.findMany({
            select: 
            {
                id: true,
                fullName: true,
                email: true,
                telphone: true,
                NIF: true,
                school: true,
                Year: true,
                Turno: true,
                AreaInterest: true,
                skills: true
           }
        });
    }

    async create(data: any) {

        const email    = data.email;
        const telphone = data.telphone;
        const NIF      = data.NIF;

        const findEmail = await this.prisma.student.findFirst({ where: { email } });

        if (findEmail) return {"message": "Este email já existe."};

        const findTelphone = await this.prisma.student.findFirst({ where: { telphone } });
        
        if (findTelphone) return {"message": "Este número já existe."};

        const findNIF = await this.prisma.student.findFirst({ where: { NIF } });

        if (findNIF) return {"message": "Este NIF já existe."};

        return this.prisma.student.create({ data });
    }

    async findOne(id: number){
        return this.prisma.student.findUnique({where: {id},
            select:{
                id: true,
                fullName: true,
                email: true,
                telphone: true,
                NIF: true,
                school: true,
                Year: true,
                Turno: true,
                AreaInterest: true,
                skills: true 
            }
        });
    }

    async update(id: number, data: any){
        return this.prisma.student.update({ where: {id}, data});
    }

    async remove(id: number){
        return this.prisma.student.delete({where: {id}})
    }
}
