/**
 * API Client for making authenticated requests to the backend
 */

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query parameters
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Workouts API
  workouts = {
    list: (params?: { type?: string; active?: string }) =>
      this.request<{ workouts: any[] }>('/workouts', { params }),

    get: (id: string) =>
      this.request<{ workout: any }>(`/workouts/${id}`),

    create: (data: any) =>
      this.request<{ workout: any }>('/workouts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<{ workout: any }>(`/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/workouts/${id}`, {
        method: 'DELETE',
      }),
  };

  // Exercises API
  exercises = {
    list: (params?: { category?: string; equipment?: string; search?: string }) =>
      this.request<{ exercises: any[] }>('/exercises', { params }),

    get: (id: string) =>
      this.request<{ exercise: any }>(`/exercises/${id}`),

    create: (data: any) =>
      this.request<{ exercise: any }>('/exercises', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<{ exercise: any }>(`/exercises/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/exercises/${id}`, {
        method: 'DELETE',
      }),
  };

  // Meal Plans API
  mealPlans = {
    list: (params?: { active?: string }) =>
      this.request<{ mealPlans: any[] }>('/meal-plans', { params }),

    get: (id: string) =>
      this.request<{ mealPlan: any }>(`/meal-plans/${id}`),

    create: (data: any) =>
      this.request<{ mealPlan: any }>('/meal-plans', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<{ mealPlan: any }>(`/meal-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/meal-plans/${id}`, {
        method: 'DELETE',
      }),
  };

  // Meals API
  meals = {
    list: (params?: { mealPlanId?: string; date?: string; type?: string }) =>
      this.request<{ meals: any[] }>('/meals', { params }),

    get: (id: string) =>
      this.request<{ meal: any }>(`/meals/${id}`),

    create: (data: any) =>
      this.request<{ meal: any }>('/meals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<{ meal: any }>(`/meals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/meals/${id}`, {
        method: 'DELETE',
      }),
  };

  // Progress Logs API
  progressLogs = {
    list: (params?: { type?: string; startDate?: string; endDate?: string; limit?: string }) =>
      this.request<{ progressLogs: any[] }>('/progress-logs', { params }),

    get: (id: string) =>
      this.request<{ progressLog: any }>(`/progress-logs/${id}`),

    create: (data: any) =>
      this.request<{ progressLog: any }>('/progress-logs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<{ progressLog: any }>(`/progress-logs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/progress-logs/${id}`, {
        method: 'DELETE',
      }),
  };

  // User Profile API
  profile = {
    get: () =>
      this.request<{ user: any }>('/user/profile'),

    update: (data: any) =>
      this.request<{ user: any }>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Dashboard Stats API
  dashboard = {
    stats: () =>
      this.request<{ stats: any }>('/dashboard/stats'),
  };
}

// Export singleton instance
export const apiClient = new APIClient();
