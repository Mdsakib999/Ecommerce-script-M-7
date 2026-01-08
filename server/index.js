require('dotenv').config();
const express = require("express");
const cors = require('cors');
const connectDB = require("./utils/db");
const path = require('path');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users')
const allowedOrigins = [
  "http://localhost:5173",
  "https://shopera-client.vercel.app"
];
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://shopera-client.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/public/images/products", express.static(path.join(process.cwd(), "public/images/products")));
const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedKey);
connectDB();
app.get("/", (req, res) => {
  res.send("Welcome to ecommerce server")
});
const multer = require("multer");



//? Routes
app.use('/api/products', productRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image size must be less than 5MB",
      });
    }
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
});
app.listen(process.env.PORT || 5000, () => console.log("Server is Running Alhamdulillah"))