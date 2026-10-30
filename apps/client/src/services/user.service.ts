import type { CreateUserDto } from "@e-pocket-assignment/shared/interfaces";
import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";
import type { ApiListQuery } from "@/interfaces";

const createUser = async (payload: CreateUserDto) => {
  return await apiService().post(`${API_ROUTES.USERS}`, payload);
};
const fetchUsers = async (params?: ApiListQuery) => {
  return await apiService().get(`${API_ROUTES.USERS}`, { params });
};

export { createUser, fetchUsers };
