import type { TransactionStatus } from "@e-pocket-assignment/shared/enums";
import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";
import type { ApiListQuery } from "@/interfaces";

const fetchTransactions = async (params?: ApiListQuery) => {
  return await apiService().get(`${API_ROUTES.TRANSACTIONS}`, { params });
};

const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
  return await apiService().patch(`${API_ROUTES.TRANSACTIONS}/${id}`, {
    status,
  });
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
  updateTransactionStatus,
  fetchTotalTransactions,
  fetchTotalTransferAmount,
  fetchPendingTransactions,
  fetchCompletedTransactions,
};
