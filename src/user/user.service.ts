import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: number, body: EditUserDto) {
    // update user with the id by the information coming from the service layer
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: { ...body },
    });

    // delete the hash
    const { hash, ...userWithoutHash } = user;

    // return the updated user information
    return userWithoutHash;
  }
}
 