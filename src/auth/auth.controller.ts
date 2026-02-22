import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('student/login')
    async loginStudent(@Body() body){
        const student = await this.authService.validateStudent(
            body.email,
            body.password,
        );

        if (!student) 
            return {"message": "Student credenciais inválidas"};
        return this.authService.login(student, "Student");
    }

    @Post('company/login')
    async loginCompany(@Body() body){
        const company = await this.authService.validateCompany(
            body.email,
            body.password
        )

        if (!company)
            return {"message": "Company credenciais inválidas"};
        return this.authService.login(company, "Company");
    }
}
