import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { AppliesService } from 'src/applies/applies.service';
import * as bcrypt from 'bcrypt'; 
@Injectable()
export class CompaniesService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ){}

    async findAll()
    {
        return this.prisma.company.findMany({
            omit: {password: true},
            include: {
                _count: {
                    select: { vagas: true }
                }
            }
        });
    }

    async create(data: any){
          data.password = await bcrypt.hash(data.password, 10);
        
        return this.prisma.company.create({ data });
    }

    async reject(id: number){
        const company = await this.prisma.company.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        const updatedCompany = await this.prisma.company.update({ 
            where: {id},
            data: {state: "rejeitado"}
        });

        // Enviar email de rejeição
        if (company) {
            await this.emailService.sendRejectionEmail(
                company.email,
                company.name,
                'Sua candidatura não foi aprovada nesta ocasião. Pode tentar novamente no futuro.'
            ).catch(error => {
                console.error('Erro ao enviar email de rejeição:', error);
            });
        }

        return updatedCompany;
    }

    async approve(id: number){
        const company = await this.prisma.company.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        const updatedCompany = await this.prisma.company.update({
            where: {id},
            data: {state: "aprovado"}
        });

        // Enviar email de aprovação
        if (company) {
            await this.emailService.sendApprovalEmail(
                company.email,
                company.name,
                'company'
            ).catch(error => {
                console.error('Erro ao enviar email de aprovação:', error);
            });
        }

        return updatedCompany;
    }

    async findByEmail(email: string)
    {
        return this.prisma.company.findUnique({where: {email},
            select:{
                id: true,
                name: true,
                email: true,
                state: true,
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

    async updateLogo(id: number, logoPath: string){
        return this.prisma.company.update({
            where: {id},
            data: {logo: logoPath} as any,
            select: {
                id: true,
                name: true,
                logo: true,
                email: true
            } as any
        });
    }
}
