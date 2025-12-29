import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateURLDto } from './generate-url.dto';
import prisma from './lib/prisma';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7);

@Injectable()
export class AppService {
  public async generateURL(
    body: GenerateURLDto
  ) {
    const short_url = nanoid();

    await prisma.urls.create({
      data: {
        short_url,
        original_url: body.original_url
      }
    });

    return {
      short_url
    };
  }

  public async redirect(
    short_url: string
  ) {
    const existUrl = await prisma.urls.findUnique({
      where: { short_url },
      select: {
        original_url: true,
        clicks: true
      }
    });

    if (!existUrl) {
      throw new NotFoundException('Cannot find this short url');
    }

    await prisma.urls.update({
      where: { short_url },
      data: {
        clicks: existUrl.clicks + 1
      }
    });

    return existUrl.original_url;
  }
}
