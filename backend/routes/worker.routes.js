import express from "express";
import { logout, workerLogin , getAllWorkers,deleteWorker , updateWorker } from "../controllers/worker.controller.js";
import { validateWorkerAndAdmin,validateAdmin  } from "../middlewares/authMiddleware.js";
import { registerWorker } from "../controllers/worker.controller.js";

const router = express.Router();

router.post("/login", workerLogin);

router.get(`/logout`,validateWorkerAndAdmin,logout);

router.get("/getworkers",validateAdmin,getAllWorkers);

router.post(`/register`,validateAdmin,registerWorker);

router.delete("/delete/:id",validateAdmin,deleteWorker);

router.put("/update/:id",validateAdmin,updateWorker );

router.get(`/logout`,validateAdmin,logout);


export default router;