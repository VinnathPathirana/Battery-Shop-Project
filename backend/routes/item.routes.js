import express from "express";
import {
  validateAdmin,
  validateWorkerAndAdmin,
} from "../middlewares/authMiddleware.js";
import {
  addBatteries,
  getAllItems,
  updateBattery,
  deleteBattery,
  rejectStock,
  getRequestedStocks,
  acceptStocks,
  getDeletedBatteries,
  updateRequestedItems,
} from "../controllers/battery.controller.js";

const router = express.Router();

router.get("/", validateWorkerAndAdmin, getAllItems);
router.post("/add", validateWorkerAndAdmin, addBatteries);
router.put("/update/:id", validateWorkerAndAdmin, updateBattery);
router.delete("/delete/:id/:reason", validateWorkerAndAdmin, deleteBattery);
router.delete("/reject/:id", validateAdmin, rejectStock);
router.get("/stocks/requested", validateAdmin, getRequestedStocks);
router.put("/stock/accept", validateAdmin, acceptStocks);
router.get('/stocks/deleted',validateAdmin,getDeletedBatteries);
// router.put("/requested/update/:id",validateAdmin,updateRequestedItems);
router.put("/requested/update/:id",validateAdmin,updateRequestedItems)

export default router;
