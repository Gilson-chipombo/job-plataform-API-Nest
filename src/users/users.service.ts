import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ){}

    async findAll(){
        return this.prisma.student.findMany({ omit: {password: true }});
    }

    async create(data: any) {

        const email    = data.email;
        const telphone = data.telphone;
        const nif      = data.NIF;

        const findEmail = await this.prisma.student.findFirst({ where: { email } });

        if (findEmail) return {"message": "Este email já existe."};

        const findTelphone = await this.prisma.student.findFirst({ where: { telphone } });
        
        if (findTelphone) return {"message": "Este número já existe."};

        data.password = await bcrypt.hash(data.password, 10);

        //const findNIF = await this.prisma.student.findFirst({ where: { nif } });

        //if (findNIF) return {"message": "Este NIF já existe."};

        return this.prisma.student.create({ data });
    }

    async findOne(id: number){
        return this.prisma.student.findUnique({where: {id},
            select:{
                id: true,
                fullName: true,
                email: true,
                telphone: true,
                nif: true,
                school: true,
                year: true,
                turno: true,
                areaInterest: true,
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

    async reject(id: number){
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                email: true,
            }
        });

        const updatedStudent = await this.prisma.student.update({ 
            where: {id},
            data: {state: "rejeitado"}
        });

        // Enviar email de rejeição
        if (student) {
            await this.emailService.sendRejectionEmail(
                student.email,
                student.fullName,
                'Sua candidatura não foi aprovada nesta ocasião. Pode tentar novamente no futuro.'
            ).catch(error => {
                console.error('Erro ao enviar email de rejeição:', error);
            });
        }

        return updatedStudent;
    }

    async delete(id: number)
    {
        return this.prisma.student.delete({where: {id}})
    }

    async approve(id: number){
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                email: true,
            }
        });

        const updatedStudent = await this.prisma.student.update({
            where: {id},
            data: {state: "aprovado"}
        });

        // Enviar email de aprovação
        if (student) {
            await this.emailService.sendApprovalEmail(
                student.email,
                student.fullName,
                'student'
            ).catch(error => {
                console.error('Erro ao enviar email de aprovação:', error);
            });
        }

        return updatedStudent;
    }

    async findByEmail(email: string)
    {
        return this.prisma.student.findUnique({where: {email},
            select:{
                id: true,
                fullName: true,
                email: true,
                state: true,
                password: true,
            }
        });
    }
}
