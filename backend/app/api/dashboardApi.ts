import api from "./api";

export interface RecentActivity {
  id: number;
  text: string;
  prediction: string;
  confidence: number;
  created_at: string;
}

export interface WeeklyData {
  day: string;
  value: number;
}

export interface DashboardStats {
  total: number;
  toxic: number;
  safe: number;
  toxicity_rate: number;
  weekly: WeeklyData[];
  recent_activity: RecentActivity[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>(
    "/dashboard/stats"
  );

  return response.data;
}