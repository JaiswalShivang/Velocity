import express from "express";
const router = express.Router();

import { getJobs } from "../controllers/jobFetch.js";
import { verifyToken } from '../middleware/auth.js';

router.get("/",verifyToken , getJobs);

export default router;