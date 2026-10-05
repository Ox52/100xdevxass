import Router from "express";
import {
  createItem,
  deleteItem,
  getItem,
  listItems,
  updateItem,
} from "../controllers/item.controller";

const router = Router();

router.post("/", createItem);
router.get("/", listItems);
router.get("/:id", getItem);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
