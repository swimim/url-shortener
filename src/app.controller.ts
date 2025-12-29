import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { GenerateURLDto } from './generate-url.dto';
import { type Response } from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle({ generate: { ttl: 60 * 1000, limit: 10 } })
  @Post('/generate')
  public async generateURL(
    @Body() body: GenerateURLDto
  ) {
    return await this.appService.generateURL(body);
  }

  @SkipThrottle({ generate: true })
  @Throttle({ redirect: { ttl: 60 * 1000, limit: 100 } })
  @Get('/:short_url')
  public async redirect(
    @Param('short_url') short_url: string,
    @Res() res: Response
  ) {
    const original_url = await this.appService.redirect(short_url);

    return res.redirect(original_url);
  }
}
