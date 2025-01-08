  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { UserModule } from './users/user.module';
  import { AuthModule } from './auth/auth.module';

  @Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',  // Hardcoded database host
        port: 5432,         // Hardcoded database port
        username: 'postgres',  // Hardcoded database username
        password: '60405425',  // Hardcoded password
        database: 'postgres',  // Hardcoded database name
        autoLoadEntities: true,
        synchronize: true,
      }),
      UserModule,
      AuthModule,
      
    ],
    controllers: [],
    providers: [],
  })
  export class AppModule {}
