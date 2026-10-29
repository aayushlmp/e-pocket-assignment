import type { LoginDto } from "@e-pocket-assignment/shared/interfaces";
import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import { apiService } from "@/services/api.service";

const signIn = async (loginDto: LoginDto) => {
  return await apiService().post(`${API_ROUTES.AUTH}/login`, loginDto);
};
const signOut = async () => {
  return await apiService().post(`${API_ROUTES.AUTH}/logout`);
};
export { signIn, signOut };
