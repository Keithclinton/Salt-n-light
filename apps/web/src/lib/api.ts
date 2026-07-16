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
  createdAt: string;
}

export interface CreateUpdateInput {
  title: string;
  body: string;
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
