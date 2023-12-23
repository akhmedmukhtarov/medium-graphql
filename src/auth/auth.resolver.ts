import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Tokens } from './entities/auth.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RegisterDto } from './dto/register.input';
import { LoginDto } from './dto/login.input';

@Resolver(() => Tokens)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => Tokens)
  register(@Args('registerDto') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Mutation(() => Tokens)
  login(@Args('loginDto') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => Tokens)
  refresh(@CurrentUser("id") id: number, @CurrentUser("refreshToken") refreshToken: string) {
    return this.authService.refresh(id,refreshToken);
  }

  @Mutation(() => String)
  logout(@CurrentUser("id") id: number) {
    return this.authService.logout(id);
  }
}
