import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  // get all bookmarks
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  // get a bookmark by id
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  // create a bookmark
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() body: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, body);
  }

  // update a bookmark
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() body: EditBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, body);
  }

  // delete a bookmark
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
