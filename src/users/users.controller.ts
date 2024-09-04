import {
  Body, Controller, Post, Get, Patch, Param, Query,
  Delete, NotFoundException, Session
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  /* Sem o parameter decorator seria mais ou menos assim:
  
  @Get('/whoami')
   whoAmI(@Request() request: Request) {
     return request.currentUser
   }
     
  */

  @Get('/whoami')
  whoAmI(@CurrentUser() user: string) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password)

    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password)

    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  /* interceptador -> é uma classe que irá modificar/filtrar a requisição antes de ser tratada OU a 
  resposta antes dela ser enviada p/ quem está fazendo a request (então pode ser usado p/ INCOMING e OUTGOING responses!)
  no caso aqui foi retirada a propriedade password da response p/ o user;*/
  // @UseInterceptors(new SerializeInterceptor(UserDto))

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id))

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body)
  }

}
