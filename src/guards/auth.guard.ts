import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId; /* se for truthy, poderá prosseguir na rota... se for falsy (false, null, undefined...), 
    será barrado. Ou seja, na rota que se utilizar o AuthGuard, só seguirão os users logados */
  }
}