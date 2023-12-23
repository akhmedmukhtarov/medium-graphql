import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { ConfigModule } from '@nestjs/config';

const formatGraphQLError = (error: any) => {
  return {
    message:
      error.extensions?.originalError?.message ||
      error.message ||
      'Internal server error',
    code: error.extensions?.originalError?.statusCode || 500,
    error: error.extensions?.originalError?.error,
  };
};

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: formatGraphQLError,
    }),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '../.env'
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
