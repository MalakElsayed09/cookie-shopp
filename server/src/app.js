import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

/**
 * 🔒 Manual CORS middleware that ALWAYS sets the right headers,
 * for both simple requests and preflights.
 * This avoids weird edge-cases with misordered cors() calls.
 */
app.use((req, res, next) => {
  const ORIGIN = process.env.CLIENT_ORIGIN; // e.g., http://localhost:5173
  const origin = req.headers.origin;

  // Only allow your frontend origin (not "*")
  if (origin === ORIGIN) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  // These are fine for any origin
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Vary", "Origin"); // caching correctness

  // End preflight quickly
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// (optional) health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Mount routes AFTER middleware
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

export default app;
