const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sl_admin_token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message || message;
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface FeedbackEntry {
  id: string;
  name: string | null;
  email: string | null;
  rating: number | null;
  message: string;
  createdAt: string;
}

export interface CreateFeedbackInput {
  name?: string;
  email?: string;
  rating?: number;
  message: string;
}

export interface UpdateEntry {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateUpdateInput {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface DevotionalEntry {
  id: string;
  reference: string;
  verseText: string;
  note: string | null;
  createdAt: string;
}

export interface CreateDevotionalInput {
  reference: string;
  verseText: string;
  note?: string;
}

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Uploads a poster straight from the browser to Vercel Blob and returns its
 * public URL. The file never passes through the API function, so it is not
 * bound by the serverless request body limit.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ApiError('Please choose a JPG, PNG, WEBP or GIF image.', 400);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ApiError('That image is larger than 8MB. Please compress it first.', 400);
  }

  const token = localStorage.getItem('sl_admin_token');
  const { upload } = await import('@vercel/blob/client');

  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: `${API_BASE}/uploads`,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return blob.url;
}

export const api = {
  submitFeedback: (data: CreateFeedbackInput) =>
    request<FeedbackEntry>('/feedback', { method: 'POST', body: JSON.stringify(data) }),

  login: (username: string, password: string) =>
    request<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  listFeedback: () => request<FeedbackEntry[]>('/feedback'),

  deleteFeedback: (id: string) => request<{ success: boolean }>(`/feedback/${id}`, { method: 'DELETE' }),

  listUpdates: () => request<UpdateEntry[]>('/updates'),

  createUpdate: (data: CreateUpdateInput) =>
    request<UpdateEntry>('/updates', { method: 'POST', body: JSON.stringify(data) }),

  deleteUpdate: (id: string) => request<{ success: boolean }>(`/updates/${id}`, { method: 'DELETE' }),

  listDevotionals: () => request<DevotionalEntry[]>('/devotionals'),

  createDevotional: (data: CreateDevotionalInput) =>
    request<DevotionalEntry>('/devotionals', { method: 'POST', body: JSON.stringify(data) }),

  deleteDevotional: (id: string) => request<{ success: boolean }>(`/devotionals/${id}`, { method: 'DELETE' }),
};
