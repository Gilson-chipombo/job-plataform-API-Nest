import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService){}
    
    async findAll()
    {
        return this.prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findById(id: number) {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!admin) {
            throw new NotFoundException('Admin não encontrado');
        }

        return admin;
    }

    async create(data: any){
        // Validar se email já existe
        const existingAdmin = await this.prisma.admin.findUnique({
            where: { email: data.email }
        });

        if (existingAdmin) {
            throw new BadRequestException('Email já cadastrado');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.admin.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                phone: data.phone || null,
                role: data.role || 'admin',
                isActive: data.isActive !== false
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async findByEmail(email: string)
    {
        return this.prisma.admin.findUnique({where: {email},
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });
    }

    async changePassword(id: number, currentPassword: string, newPassword: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                password: true
            }
        });

        if (!admin) {
            throw new NotFoundException('Admin não encontrado');
        }

        // Verificar se a senha atual está correta
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Senha atual incorreta');
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return this.prisma.admin.update({
            where: { id },
            data: { password: hashedPassword },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }

    async delete(id: number) {
        const admin = await this.prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            throw new NotFoundException('Admin não encontrado');
        }

        return this.prisma.admin.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }

    async update(id: number, data: any) {
        const admin = await this.prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            throw new NotFoundException('Admin não encontrado');
        }

        return this.prisma.admin.update({
            where: { id },
            data: {
                name: data.name || undefined,
                phone: data.phone !== undefined ? data.phone : undefined,
                role: data.role || undefined,
                isActive: data.isActive !== undefined ? data.isActive : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findAllPendentes()
    {
        const student = await this.prisma.student.findMany({ where: { state: "pendente" } });

         const companies = await this.prisma.company.findMany({
            where: { state: "pendente" }
        });

        return { student, companies }
    }

    async dashboardStats() {

        const totalUsuarios = await this.prisma.student.count();

        const totalEstudantes = await this.prisma.student.count({
            where: { type: "estudante" }
        });

        const totalEmpresas = await this.prisma.company.count({
            where: { type: "empresa" }
        });

        const pendentes = await this.prisma.student.count({
            where: { state: "pendente" }
        });

        const aprovados = await this.prisma.student.count({
            where: { state: "aprovado" }
        });

        const rejeitados = await this.prisma.student.count({
            where: { state: "rejeitado" }
        });

        const bloqueados = await this.prisma.student.count({
            where: {  state: "rejeitado"  }
        });

        const empresaPendentes = await this.prisma.company.count({
            where: { state: "pendente" }
        });

        const empresaAprovados = await this.prisma.company.count({
            where: { state: "aprovado" }
        });

        const empresaRejeitados = await this.prisma.company.count({
            where: { state: "rejeitado" }
        });

        const empresaBloqueados = await this.prisma.company.count({
            where: {  state: "rejeitado"  }
        });

        const vagas = await this.prisma.vaga.count();

        return {
            totalUsuarios,
            totalEstudantes,
            totalEmpresas,
            pendentes,
            aprovados,
            rejeitados,
            bloqueados,
            vagas,
            empresaAprovados,
            empresaPendentes,
            empresaBloqueados,
            empresaRejeitados
        };
    }
}
