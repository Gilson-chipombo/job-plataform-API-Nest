import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { RegisterRepository } from '../users/repository/register.repository';
// import { AuthGoogleRepository } from './repository/authgoogle.repository';
// import { SettingsService } from '../settings/settings.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthGoogleService {
  constructor(
    // private readonly authGoogleRepository: AuthGoogleRepository,
    private readonly jwtService: JwtService,
    // private readonly registerRepository: RegisterRepository,
    // private readonly settingsService: SettingsService,

  ) {}

  async loginWithGoogle(googleProfile: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    try{
      // const user = await this.authGoogleRepository.upsertGoogleUser(googleProfile);

      const token = this.jwtService.sign({
        email: googleProfile.email,
        type: 'access'
      }, { expiresIn: '15m' });
      // const refreshToken = this.jwtService.sign({
      //   id: user.id,
      //   role: user.role,
      //   type: 'refresh',
      // }, { expiresIn: '7d', secret: process.env.REFRESH_TOKEN });
      // await this.registerRepository.registerRefreshToken(refreshToken, JSON.stringify({userId: user.id}));
      return {
        status: 201,
        access_token: token,
        // refresh_token: refreshToken,
        user: {
          email: googleProfile.email,
          name: `${googleProfile.firstName} ${googleProfile.lastName}`,
        },
      };
    }
    catch (error) {
      console.error('Error in loginWithGoogle:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }   
}
