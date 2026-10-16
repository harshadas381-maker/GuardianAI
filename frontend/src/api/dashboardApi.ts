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
  // Main statistics
  total: number;
  toxic: number;
  safe: number;

  // Classification counts
  cyberbullying: number;
  offensive: number;
  hate: number;

  // Harmful content
  harmful: number;
  harmful_rate: number;

  // Frontend compatibility
  toxicity_rate: number;
  cyberbullying_rate: number;

  // Source statistics
  text_analyses: number;
  image_analyses: number;

  // Charts
  weekly: WeeklyAnalysis[];

  // Recent activity
  recent_activity: DashboardRecentActivity[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(
    "/dashboard/stats"
  );

  return response.data;
};