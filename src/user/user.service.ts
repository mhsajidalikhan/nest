import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserdto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async editUser(
        userId: number,
        dto: EditUserdto,
      ) {
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...dto,
          },
        });
    
        delete user.hash;
    
        return user;
      }
    }