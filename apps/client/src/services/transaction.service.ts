import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";

const fetchTotalTransactions = async () => {
  return await apiService().get(`${API_ROUTES.TRANSACTIONS}/summary/total`);
};

const fetchTotalTransferAmount = async () => {
  return await apiService().get(
    `${API_ROUTES.TRANSACTIONS}/summary/transfer-amount`,
  );
};

const fetchPendingTransactions = async () => {
  return await apiService().get(`${API_ROUTES.TRANSACTIONS}/summary/pending`);
};

const fetchCompletedTransactions = async () => {
  return await apiService().get(`${API_ROUTES.TRANSACTIONS}/summary/completed`);
};

export {
  fetchTotalTransactions,
  fetchTotalTransferAmount,
  fetchPendingTransactions,
  fetchCompletedTransactions,
};
