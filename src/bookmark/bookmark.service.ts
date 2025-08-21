import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  // get all bookmarks
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
    });

    if (!bookmarks || bookmarks.length === 0) {
      throw new NotFoundException('No bookmarks found');
    }

    return bookmarks;
  }

  // get a bookmark by id
  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return bookmark;
  }

  // create a bookmark
  async createBookmark(userId: number, body: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...body,
      },
    });

    return bookmark;
  }

  // update a bookmark
  async updateBookmark(
    userId: number,
    bookmarkId: number,
    body: EditBookmarkDto,
  ) {
    // find the bookmark to be updated
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId },
    });

    // bookmark not found
    if (!bookmark) throw new NotFoundException('Bookmark not found');

    // check if the bookmark is owned by the user
    if (bookmark.userId !== userId)
      throw new ForbiddenException('Access to content denied');

    // update the bookmark
    const updatedBookmark = await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...body },
    });

    // return the updated bookmark
    return updatedBookmark;
  }

  // delete a bookmark
  async deleteBookmark(userId: number, bookmarkId: number) {
    // find the bookmark to be deleted
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId },
    });

    // bookmark not found
    if (!bookmark) throw new NotFoundException('Bookmark not found');

    // check if the bookmark is owned by the user
    if (bookmark.userId !== userId)
      throw new ForbiddenException('Access to content denied');

    // delete the bookmark
    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
