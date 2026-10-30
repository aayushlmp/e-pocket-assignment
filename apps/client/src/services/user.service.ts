import type { CreateUserDto } from "@e-pocket-assignment/shared/interfaces";
import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";

const createUser = async (payload: CreateUserDto) => {
  return await apiService().post(`${API_ROUTES.USERS}`, payload);
};
const fetchUsers = async () => {
  return await apiService().get(`${API_ROUTES.USERS}`);
};

export { createUser, fetchUsers };
