import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { GenerateURLDto } from './generate-url.dto';
import { type Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/generate')
  public async generateURL(
    @Body() body: GenerateURLDto
  ) {
    return await this.appService.generateURL(body);
  }

  @Get('/:short_url')
  public async redirect(
    @Param('short_url') short_url: string,
    @Res() res: Response
  ) {
    const original_url = await this.appService.redirect(short_url);

    return res.redirect(original_url);
  }
}
