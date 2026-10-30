import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";

const fetchStatusDistribution = async () => {
  return await apiService().get(
    `${API_ROUTES.TRANSACTIONS_GRAPHS}/status-distribution`,
  );
};

const fetchTransactionVolume = async (period: "7d" | "30d" | "90d" = "7d") => {
  return await apiService().get(
    `${API_ROUTES.TRANSACTIONS_GRAPHS}/transaction-volume`,
    { params: { period } },
  );
};

const fetchCurrencyBreakdown = async () => {
  return await apiService().get(
    `${API_ROUTES.TRANSACTIONS_GRAPHS}/currency-breakdown`,
  );
};

const fetchFeeTrends = async (period: "7d" | "30d" | "90d" = "30d") => {
  return await apiService().get(
    `${API_ROUTES.TRANSACTIONS_GRAPHS}/fee-trends`,
    { params: { period } },
  );
};

export {
  fetchStatusDistribution,
  fetchTransactionVolume,
  fetchCurrencyBreakdown,
  fetchFeeTrends,
};
