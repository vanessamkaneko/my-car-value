import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule = especifica qual arquivo .env queremos ler |  ConfigService = expõe a info do .env p/ o resto da aplicação
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` //definido nos comandos no package.json
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       synchronize: true,
    //       /* synchronize: true garante que sempre que typeorm seja iniciado, ele verifique a estrutura das entidades e modifique
    //       o banco de dados de acordo com essa estutura, garantindo que o bd esteja sempre c/ a estutura de acordo com a entidade... 
    //       E qual o problema disso? Se acidentalmente for apagado uma propriedade da entidade, a coluna com as infos dessa 
    //       propriedade serão apagados do bd também!!! 
          
    //       -> Então, p/ ambiente de desenvolvimento o synchronize: true é muito útil, mas p/ o deployment utilizar o synchronize: false
          
    //       */
    //       entities: [User, Report]
    //     }
    //   }
    // }),
    // criação e conexão ao banco de dados
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot(),
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
  constructor(
    private configService: ConfigService
  ) {}

  /* essa função será chamada automaticamente sempre que nossa aplicação startar; nela podemos definir uma middleware que
  irá executar p/ todas as requests recebidas em todas as rotas (middleware GLOBAL) */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')] // será usado p/ encriptar a info guardada no cookie
    })).forRoutes('*')
  }
}


/* aplicamos o app_pipe e o validationpipe aqui também (que antes estava no main) pois nos testes a configuração do main não é
executada... aqui estamos dizendo que toda instância do app.module criada terá a aplicação validationpipe p/ as requests
recebidas... ou seja, será aplicada P/ TODAS AS REQUESTS EM NOSSA APLICAÇÃO */
