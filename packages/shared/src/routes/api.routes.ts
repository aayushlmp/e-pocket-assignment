
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION ?? 'v1'}`;
export const API_ROUTES = {
  USERS: `${API_PREFIX}/users`,
  AUTH: `${API_PREFIX}/auth`,
  TRANSACTIONS: `${API_PREFIX}/transactions`,
  HEALTH_CHECK: `${API_PREFIX}/healthcheck`,
}