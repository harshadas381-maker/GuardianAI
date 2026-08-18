import api from "./api";

export interface DashboardRecentActivity {
  id: number;
  text: string;
  prediction: string;
  confidence: number;
  source: "text" | "image" | string;
  filename: string | null;
  created_at: string;
}

export interface WeeklyAnalysis {
  day: string;
  value: number;
}

export interface DashboardStats {
  total: number;
  toxic: number;
  safe: number;
  text_analyses: number;
  image_analyses: number;
  toxicity_rate: number;

  weekly: WeeklyAnalysis[];

  recent_activity: DashboardRecentActivity[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(
    "/dashboard/stats"
  );

  return response.data;
};