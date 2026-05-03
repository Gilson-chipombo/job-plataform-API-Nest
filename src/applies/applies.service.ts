import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AppliesService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService
    ){}
    
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
                id: true,
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

    // Aprovar candidatura
    async approveApplication(id: number): Promise<any> {
        console.log('approveApplication chamado com id:', id, 'tipo:', typeof id);
        
        const apply = await this.prisma.apply.findUnique({
            where: { id: Number(id) },
            include: {
                student: {
                    select: {
                        fullName: true,
                        email: true,
                    }
                },
                vaga: {
                    select: {
                        title: true,
                        company: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!apply) {
            throw new BadRequestException('Candidatura não encontrada');
        }

        const updatedApply = await this.prisma.apply.update({
            where: { id },
            data: { status: 'aprovada' }
        });

        // Enviar email de aprovação ao candidato
        try {
            await this.emailService.sendApplicationApprovalEmail(
                apply.student.email,
                apply.student.fullName,
                apply.vaga.title,
                apply.vaga.company.name
            );
        } catch (error) {
            console.error('Erro ao enviar email de aprovação:', error);
        }

        return updatedApply;
    }

    // Rejeitar candidatura
    async rejectApplication(id: number, reason?: string): Promise<any> {
        console.log('rejectApplication chamado com id:', id, 'tipo:', typeof id);
        
        const apply = await this.prisma.apply.findUnique({
            where: { id: Number(id) },
            include: {
                student: {
                    select: {
                        fullName: true,
                        email: true,
                    }
                },
                vaga: {
                    select: {
                        title: true,
                        company: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!apply) {
            throw new BadRequestException('Candidatura não encontrada');
        }

        const updatedApply = await this.prisma.apply.update({
            where: { id },
            data: { status: 'rejeitada' }
        });

        // Enviar email de rejeição ao candidato
        try {
            await this.emailService.sendApplicationRejectionEmail(
                apply.student.email,
                apply.student.fullName,
                apply.vaga.title,
                apply.vaga.company.name,
                reason || 'Não foi selecionado nesta ocasião. Obrigado pela sua candidatura!'
            );
        } catch (error) {
            console.error('Erro ao enviar email de rejeição:', error);
        }

        return updatedApply;
    }

}
