import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly _jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto) {
    try {
      const { password, ...rest } = registerDto;
      const salt: number = 10;
      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, salt),
      });

      const savedUser = await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        user: userWithoutPassword,
        token: this.getJwtToken({ id: savedUser.id }),
      };
    } catch (error) {}
  }

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const user = await queryBuilder
      .where('user.email = :email', {
        email: email,
      })
      .getOne();

    if (!user) throw new BadRequestException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials area not valid');

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  public async checkAuthStatus(user: User) {
    const { password: _, ...rest } = user;
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'fullName', 'email'],
    });
  }
}
