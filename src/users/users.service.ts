import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password })

    return this.repo.save(user)
  }

  findOne(id: number) { // retorna apenas um registro ou retorna null se não encontrado
    if(!id) {
      return null
    }

    return this.repo.findOne({ id });
  }

  find(email: string) { // retorna um array com todos os registros que correspondem ao critério de pesquisa; array vazio se não encontrado
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found')
    }

    Object.assign(user, attrs)

    return this.repo.save(user)
  }


  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.repo.remove(user)
  }
}


