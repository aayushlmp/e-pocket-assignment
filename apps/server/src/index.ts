import {app} from "./app.ts";
import { AppDataSource } from "./db/index.ts";
import "reflect-metadata";

const PORT = process.env.PORT || 3000;
const initialize = async () => {
  const connection = await AppDataSource.initialize()
  try {
    if(connection?.isInitialized) {
      console.log("Database connected via TypeORM successfully!");
      app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
      });
    } else {
      console.error(`Database connection failed`);
    }
  } catch(error) {
    console.error(`Database connection failed: ${error}`);
  }
}
app.get('/', (_req, res) => {
  res.send('Express server is running!');
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

initialize();