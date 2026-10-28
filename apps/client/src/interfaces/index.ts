export type environment = "dev" | "staging" | "prod";
export interface CardWrapperProps {
  /** The main dynamic component, form, chart, or layout inside the card */
  children?: React.ReactNode;
  /** Main heading title string */
  title: React.ReactNode | string;
  /** Sub-heading descriptive text */
  description?: React.ReactNode | string;
  /** Optional content layout badge */
  badge?: React.ReactNode;
  /** Optional secondary component or button to render in the top right corner */
  action?: React.ReactNode;
  /** Optional content layout or action buttons inside the bottom footer */
  footer?: React.ReactNode;
  /** Additional Tailwind styling overrides for the card shell container */
  className?: string;
}
export interface AppConfig {
  API_URL: string;
  APP_VERSION: string;
  APP_ENV: environment;
  ENABLE_ANALYTICS?: boolean;
}
