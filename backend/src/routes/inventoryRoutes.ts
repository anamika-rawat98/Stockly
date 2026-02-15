import express from "express";
import Inventory from "../models/Inventory";
import auth, { AuthRequest } from "../middleware/auth";

const router = express.Router();

//Get all items of the inventory for the authenticated user
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const items = await Inventory.find({ userId: req.userId });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

//Add items to inventory for the authenticated user
router.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const { name, quantity, unit, expiryDate, minQuantity } = req.body;
    const newItem = await Inventory.create({
      userId: req.userId,
      name,
      quantity,
      unit,
      expiryDate,
      minQuantity,
    });
    res.status(201).json({ data: newItem, message: "Items added to the inventory" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

//Edit items in inventory.   // /:id means it expects the id to be appear like - /api/inventory/4567898765
router.put("/:id", auth, async (req: AuthRequest, res) => {
  try {
    //It finds where the inventory item where the _id and userId matches the request. and then it replaces that data from the req.bodyand returns the updated item.
    const updatedItem = await Inventory.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      req.body,
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found!" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

//Delete from inventory.

router.delete("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const deletedItem = await Inventory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found!" });
    }
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router;
