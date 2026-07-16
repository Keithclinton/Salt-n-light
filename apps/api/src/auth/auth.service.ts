import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ username, password }: LoginDto) {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminUsername || !adminPasswordHash) {
      throw new UnauthorizedException('Admin account is not configured');
    }

    const validUsername = username === adminUsername;
    const validPassword = validUsername && (await bcrypt.compare(password, adminPasswordHash));

    if (!validUsername || !validPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = await this.jwtService.signAsync({ sub: username, role: 'admin' });
    return { accessToken };
  }
}
