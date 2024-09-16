import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// só p/ garantir que o que será fornecido p/ o Serialize é uma classe (substituindo o type any)
interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //   Para fazer algo com a requisição antes dela ser tratada... Código aqui!
    //   console.log('Im running before the handler', context)

    return handler.handle().pipe(
      map((data: any) => { // data é o que será enviado como resposta
        // Para fazer algo com a resposta antes dela ser enviada... Código aqui!
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true // garante que apenas as propriedades marcadas com @expose serão expostas
        })
      })
    )
  }
}

/* aqui por ex., com o UserDto, transformaremos a resposta em uma instância do UserDto antes dela ser transformada automaticamente em JSON p/
ser enviada ao usuário */