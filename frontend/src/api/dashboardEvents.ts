export const DASHBOARD_REFRESH_EVENT =
  "guardianai-dashboard-refresh";

export const notifyDashboardRefresh = () => {
  window.dispatchEvent(
    new CustomEvent(DASHBOARD_REFRESH_EVENT)
  );
};