import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService){}
    
    @Get()
    getAll(){
        return this.adminService.findAll();
    }

    @Get('pendentes')
    getAllPendentes(){
        return this.adminService.findAllPendentes();
    }

    @Get('dashboard')
    async dashboard() {
        return this.adminService.dashboardStats();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.findById(id);
    }

    @Post()
    createAdmin(@Body() body){
        return this.adminService.create(body);
    }

    @Post('create')
    create(@Body() body){
        return this.adminService.create(body);
    }

    @Put(':id')
    updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any
    ) {
        return this.adminService.update(id, body);
    }

    @Post(':id/change-password')
    changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { currentPassword: string; newPassword: string }
    ) {
        return this.adminService.changePassword(id, body.currentPassword, body.newPassword);
    }

    @Delete(':id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.delete(id);
    }
}
