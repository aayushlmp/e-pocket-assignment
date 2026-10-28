import type { AppConfig } from "@/interfaces";
let config: AppConfig | null = null;

const loadAppConfig = async () => {
  const response = await fetch("/config/config.json", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load config.json: ${response.status}`);
  }
  config = await response.json();
  return config;
};

const getAppConfig = (): AppConfig => {
  if (!config) {
    throw new Error("App config has not loaded. Call loadAppConfig() first.");
  }
  return config;
};

export { loadAppConfig, getAppConfig };
