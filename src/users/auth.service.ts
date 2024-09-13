import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util"; // permite trabalhar com promises ao invés de callbacks

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    /*Checks if the users array has any elements. If the array has a length greater than 0, this condition evaluates to true. 
    It means that users with the given criteria already exist */
    if (users.length) {
      throw new BadRequestException('Email in use')
    }

    const salt = randomBytes(8).toString('hex')

    const hash = (await scrypt(password, salt, 32)) as Buffer // 32 caracteres

    const result = salt + '.' + hash.toString('hex')

    const user = await this.usersService.create(email, result)

    return user;
  }

  async signin(email: string, password: string) {
    /* The destructuring assignment here takes the first element of the array returned by find and assigns it 
    to the user variable */
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found')
    }

    /* This part splits the password string using the dot . as the delimiter. It returns an array with two elements: 
    the salt and the storedHash */
    const [salt, storedHash] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password')
    }
    
    return user;
  }
}
