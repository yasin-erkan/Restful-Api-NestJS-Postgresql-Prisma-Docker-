import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // !  with useGuards we check the access token
  // getUser to get user information
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getUsers(@GetUser() user: User) {
    return user;
  }

  // with useGuards we check the access token
  // @GetUser('id') to get user id
  // @Body to get body
  // EditUserDto to check the body's data
  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  updateUser(@GetUser('id') id: number, @Body() body: EditUserDto) {
    return this.userService.updateUser(id, body);
  }
}
