import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";

const fetchTransactions = async () => {
  return await apiService().get(`${API_ROUTES.TRANSACTIONS}`);
};

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
  fetchTransactions,
  fetchTotalTransactions,
  fetchTotalTransferAmount,
  fetchPendingTransactions,
  fetchCompletedTransactions,
};
