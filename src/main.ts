import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['adfksjdah'] // será usado p/ encriptar a info guardada no cookie
  }))
  app.useGlobalPipes (
    new ValidationPipe({
      whitelist: true, // filtra as infos da request, garantindo que vamos receber apenas as infos que queremos, ignorando
      // infos adicionais enviadas pelo user
    })
  )
  await app.listen(3000);
}
bootstrap();
