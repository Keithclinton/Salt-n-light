import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDevotionalDto } from './dto/create-devotional.dto';

@Injectable()
export class DevotionalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDevotionalDto) {
    return this.prisma.devotional.create({ data: dto });
  }

  findAll() {
    return this.prisma.devotional.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const existing = await this.prisma.devotional.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Devotional not found');
    }
    await this.prisma.devotional.delete({ where: { id } });
    return { success: true };
  }
}
