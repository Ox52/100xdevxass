import "dotenv/config";
import app from "./index";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
