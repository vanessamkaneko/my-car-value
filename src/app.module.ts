import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule = especifica qual arquivo .env queremos ler |  ConfigService = expõe a info do .env p/ o resto da aplicação
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` //definido nos comandos no package.json
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report]
        }
      }
    }),
    // criação e conexão ao banco de dados
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    // applying a globally scoped pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, /* filtra as infos da request, garantindo que vamos receber apenas as infos que queremos, ignorando
        infos adicionais enviadas pelo user (no caso aqui sendo aplicada globalmente - todas as requests - todas as rotas) */ 
      })
    }
  ],
})
export class AppModule { 
  /* essa função será chamada automaticamente sempre que nossa aplicação startar; nela podemos definir uma middleware que
  irá executar p/ todas as requests recebidas em todas as rotas (middleware GLOBAL) */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: ['adfksjdah'] // será usado p/ encriptar a info guardada no cookie
    })).forRoutes('*')
  }
}


/* aplicamos o app_pipe e o validationpipe aqui também (que antes estava no main) pois nos testes a configuração do main não é
executada... aqui estamos dizendo que toda instância do app.module criada terá a aplicação validationpipe p/ as requests
recebidas... ou seja, será aplicada P/ TODAS AS REQUESTS EM NOSSA APLICAÇÃO */
