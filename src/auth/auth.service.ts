import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { CompaniesService } from 'src/companies/companies.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor( private usersService: UsersService, 
                 private companyService: CompaniesService,
                 private jwtService: JwtService   
    ){}

    async validateStudent(email: string, pass: string){
        const student = await this.usersService.findByEmail(email);

        if (!student) return null;

        //const isMatch = await bcrypt.compare(pass, student.password);
        
        if (student.password != pass) return null;
        return student;
    }

    async validateCompany(email: string, pass: string){
        const company = await this.companyService.findByEmail(email);

        if (!company) return null;
        if (company.password != pass) return null;
        return company;
    }

    async login(user: any, userType: string) {
        const payload = {sub: user.id, email: user.email};
        const idUser = user.id;
        return {
            access_token: this.jwtService.sign(payload),
            idUser,
            userType
        };
    }
}
