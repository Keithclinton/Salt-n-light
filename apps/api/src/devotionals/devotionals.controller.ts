import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDevotionalDto } from './dto/create-devotional.dto';
import { DevotionalsService } from './devotionals.service';

@Controller('devotionals')
export class DevotionalsController {
  constructor(private readonly devotionalsService: DevotionalsService) {}

  @Get()
  findAll() {
    return this.devotionalsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateDevotionalDto) {
    return this.devotionalsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devotionalsService.remove(id);
  }
}
