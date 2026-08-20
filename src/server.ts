import app from "./app";
import { config } from "./config/config";

app.listen(config.PORT, () => {
  console.log(`Server running on ${config.APP_URL}`);
  console.log(`Swagger docs at ${config.APP_URL}/api-docs`);
});
