import { Controller, Get, Param, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get()
  findAll(
    @Query('period') period: string = 'all',
    @Query('limit') limit: string = '100',
  ) {
    return this.ratingsService.findAll(period, parseInt(limit, 10));
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.ratingsService.findByUserId(userId);
  }
}
