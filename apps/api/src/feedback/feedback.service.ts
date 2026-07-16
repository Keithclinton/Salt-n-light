import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data: dto });
  }

  findAll() {
    return this.prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Feedback entry not found');
    }
    await this.prisma.feedback.delete({ where: { id } });
    return { success: true };
  }
}
