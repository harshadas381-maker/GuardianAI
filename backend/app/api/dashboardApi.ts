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
  // Main totals
  total: number;

  // Prediction classes
  toxic: number;
  safe: number;
  cyberbullying: number;
  offensive: number;
  hate: number;

  // Harmful content
  harmful: number;
  harmful_rate: number;

  // Backward compatibility
  toxicity_rate: number;

  // Cyberbullying rate
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