import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // conexão da entidade ao seu parent module e criação do repositório
  controllers: [UsersController],
  providers: [UsersService, AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
})
export class UsersModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}

/*     {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    
    -> Qualquer request recebida por qualquer lugar da aplicação (não só nos controller deste módulo) terão este interceptor
    aplicado!
    
    */
