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

const deleteTransaction = async (id: string) => {
  return await apiService().delete(`${API_ROUTES.TRANSACTIONS}/${id}`);
};

const addTransactionNote = async (id: string, comment: string) => {
  return await apiService().post(`${API_ROUTES.TRANSACTIONS}/${id}/notes`, {
    comment,
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
  deleteTransaction,
  addTransactionNote,
  fetchTotalTransactions,
  fetchTotalTransferAmount,
  fetchPendingTransactions,
  fetchCompletedTransactions,
};
