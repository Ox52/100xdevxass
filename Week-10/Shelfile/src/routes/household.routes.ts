import Router from "express";
import {
  createHousehold,
  getMyHousehold,
  joinHousehold,
} from "../controllers/household.controller";

const router = Router();

router.post("/", createHousehold);
router.post("/join", joinHousehold);
router.get("/me", getMyHousehold);

export default router;
