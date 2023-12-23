import { JwtService } from '@nestjs/jwt';
import { ConflictException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareSync, hashSync } from 'bcrypt';
import { env } from 'config/env.config';
import { RegisterDto } from './dto/register.input';
import { LoginDto } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}
  async register(registerDto: RegisterDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });
    if (user) {
      throw new ConflictException(`User ${user.email} already exists`);
    }
    const hashedPassword = hashSync(registerDto.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        role: 'user',
        hashedPassword,
      },
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)
    return tokens
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({where: {email: loginDto.email}})
    if(!user) {
      throw new HttpException(`User with email ${loginDto.email} not found`, HttpStatus.NOT_FOUND)
    }
    const passwordCompare = compareSync(loginDto.password, user.hashedPassword)
    if(!passwordCompare) {
      throw new HttpException(`Wrong password or|and email`, HttpStatus.UNAUTHORIZED)
    }
    const tokens = await this.getTokens(user.id, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async refresh(id: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({where:{id}})
    if (!user){
      throw new ForbiddenException("User not found")
    }
    if(!user.hashedRefreshToken){
      throw new ForbiddenException("User has been logged out")
    }
    const tokensMatch = compareSync(refreshToken, user.hashedRefreshToken)
    if(!tokensMatch){
      throw new ForbiddenException("User not found")
    }
    const tokens = await this.getTokens(user.id,user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(id: number) {
    await this.updateRefreshToken(id, null)
    return "Succesfully logged out"
  }

  async getTokens(userId: number, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          role,
        },
        {
          secret: env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          role,
        },
        {
          secret: env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    if (refreshToken != null){
      const hashedRefreshToken = hashSync(refreshToken, 10);
      await this.prismaService.user.update({
        data: {hashedRefreshToken},
        where: {id: userId}
      });
      return
    }
    await this.prismaService.user.update({
      data: {hashedRefreshToken: null},
      where: {id: userId}
    });
    return
  }
}
