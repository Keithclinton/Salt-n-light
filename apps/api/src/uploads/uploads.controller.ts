import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

@Controller('uploads')
export class UploadsController {
  /**
   * Issues a short-lived token so the browser can upload straight to Vercel
   * Blob. The file never passes through this function, which keeps it clear of
   * the 4.5 MB serverless request body limit.
   *
   * No `onUploadCompleted` callback is registered on purpose: Blob would call
   * it without our Authorization header and the guard below would reject it.
   * The client sends back the resulting URL when it creates the update.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createToken(@Req() req: Request, @Body() body: HandleUploadBody) {
    return handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maximumSizeInBytes: MAX_IMAGE_BYTES,
        addRandomSuffix: true,
      }),
    });
  }
}
