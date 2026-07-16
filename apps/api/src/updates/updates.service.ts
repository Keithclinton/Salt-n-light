import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpdateDto } from './dto/create-update.dto';

@Injectable()
export class UpdatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUpdateDto) {
    return this.prisma.update.create({ data: dto });
  }

  findAll() {
    return this.prisma.update.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const existing = await this.prisma.update.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Update not found');
    }
    await this.prisma.update.delete({ where: { id } });
    return { success: true };
  }
}
