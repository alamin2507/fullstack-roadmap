import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './lib/mongodb';
import { User } from './models/User';
import { Progress } from './models/Progress';

const UserModel = User as any;
const ProgressModel = Progress as any;

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fswd-master-jwt-secret-key-9988';

const app = express();
app.use(express.json());

async function startServer() {
  // Try to connect to MongoDB, let application continue even if it fails initially
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("MongoDB connection failed on server start:", error);
  }

  // --- API MIDDLEWARE FOR AUTH ---
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };

  // --- AUTH ENDPOINTS ---

  // Register New User
  app.post('/api/auth/register', async (req: any, res: any) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    try {
      await connectToDatabase();
      const existingUser = await UserModel.findOne({ username: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') } });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new UserModel({
        username: trimmedUsername,
        password: hashedPassword
      });
      await newUser.save();

      // Create empty progress for the user
      const newProgress = new ProgressModel({
        userId: newUser._id,
        completedTasks: []
      });
      await newProgress.save();

      // Generate JWT
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          username: newUser.username
        }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server registration error" });
    }
  });

  // Login Existing User
  app.post('/api/auth/login', async (req: any, res: any) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      await connectToDatabase();
      const user = await UserModel.findOne({ username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

      res.json({
        message: "Logged in successfully",
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server login error" });
    }
  });

  // Get Current User Profile
  app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    try {
      await connectToDatabase();
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- PROGRESS TRACKING ENDPOINTS ---

  // Get user's progress
  app.get('/api/progress', authenticateToken, async (req: any, res: any) => {
    try {
      await connectToDatabase();
      let progress = await ProgressModel.findOne({ userId: req.userId });
      if (!progress) {
        progress = new ProgressModel({
          userId: req.userId,
          completedTasks: []
        });
        await progress.save();
      }

      res.json({ completedTasks: progress.completedTasks });
    } catch (error) {
      console.error("Fetch progress error:", error);
      res.status(500).json({ error: "Failed to fetch progress details" });
    }
  });

  // Save/update user's progress
  app.post('/api/progress', authenticateToken, async (req: any, res: any) => {
    const { completedTasks } = req.body;

    if (!Array.isArray(completedTasks)) {
      return res.status(400).json({ error: "completedTasks must be an array of strings" });
    }

    try {
      await connectToDatabase();
      let progress = await ProgressModel.findOne({ userId: req.userId });
      if (!progress) {
        progress = new ProgressModel({
          userId: req.userId,
          completedTasks
        });
      } else {
        progress.completedTasks = completedTasks;
        progress.updatedAt = new Date();
      }

      await progress.save();
      res.json({ completedTasks: progress.completedTasks });
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({ error: "Failed to save progress details" });
    }
  });

  // --- VITE DEV SERVER OR STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
