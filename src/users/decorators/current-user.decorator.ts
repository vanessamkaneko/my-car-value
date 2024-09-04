import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
)

/* o que estiver nesta função será retornado como parâmetro na função em que é chamado o decorator @CurrentUser();
o data seria o parâmetro fornecido ao @CurrentUser() mas como não precisamos fornecer parâmetro nenhum a ele, colocamos
o data como sendo do tipo never */

/* ExecutionContext -> consegue lidar com vários tipos de protocolos de comunicação (incoming request) 
como websockets, gRPC, GraphQL, etc e não só as de protocolo http; ele é como se fosse um pacote envolvendo o incoming request*/

/* Um parameter decorator não consegue se utilizar do sistema de injeção de dependência, não conseguindo acessar uma
instância de uma classe assim -> no caso o @CurrentUser() não teria acesso a instância do UsersService. Para esse problema,
criaremos o CurrentUser Interceptor, que irá ler o Session Object e tbm terá acesso a instância do UsersService, então dentro
desse Interceptor será possível se utilizar dos métodos do UsersService... 

**Um parameter decorator não consegue se utilizar do sistema de injeção de dependência MAS consegue se utilizar do request
object, dessa forma, uma info obtida pelo Interceptor pode ser passada para um decorator através do request object...

**Estamos nos utilizando do parameter decorator p/ deixar o código mais claro e intuitivo... */