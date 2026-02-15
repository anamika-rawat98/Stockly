import express from "express";
import ShoppingItem from "../models/ShoppingItem";
import auth, { AuthRequest } from "../middleware/auth";
import Inventory from "../models/Inventory";

const router = express.Router();

// Getting all shopping items for the authenticated user

router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const items = await ShoppingItem.find({
      userId: req.userId,
    });
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch items" });
  }
});

// Editing a shopping item
router.put("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const { name, quantity, unit } = req.body;
    const updatedItem = await ShoppingItem.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        name,
        quantity,
        unit,
      },
      { new: true }, // returns updated document
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    return res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to edit item.",
    });
  }
});

//Adding low stock or expired items from inventory or manually to the shopping list.
router.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const { inventoryItemId, name, quantity, unit } = req.body;

    //If the item is added from the inventory, then the req will contain the inventoryItemId, in that case find the inventoryitem in the inventory list.
    if (inventoryItemId) {
      const inventoryItem = await Inventory.findOne({
        _id: inventoryItemId,
        userId: req.userId,
      });

      if (!inventoryItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }

      //After getting the inventory item, that needs to get added in the shopping list, we will add the name and unit from the inventory data, and add the quantity that we will get in the body(ask frontend for this).
      const shoppingItem = await ShoppingItem.create({
        userId: req.userId,
        name: inventoryItem.name,
        quantity: quantity,
        unit: inventoryItem.unit,
      });

      // Now delete from inventory
      await Inventory.findOneAndDelete({
        _id: inventoryItemId,
        userId: req.userId,
      });

      return res.status(201).json({
        data: shoppingItem,
        message: "Item has been moved successfully to the shopping list.",
      });
    }

    // Manually added - user provides their own data
    if (!name || !quantity || !unit) {
      return res
        .status(400)
        .json({ message: "Name, quantity and unit are required" });
    }

    const shoppingItem = await ShoppingItem.create({
      userId: req.userId,
      name,
      quantity,
      unit,
    });
    res.status(201).json({
      data: shoppingItem,
      message: "Items has been added to the shopping list.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to add item" });
  }
});

//Deleting from shopping list and moving to inventory list.
router.delete("/:id", auth, async (req: AuthRequest, res) => {
  const { expiryDate, ismoving } = req.body;
  try {
    const shoppingItem = await ShoppingItem.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!shoppingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (ismoving) {
      await Inventory.create({
        userId: req.userId,
        name: shoppingItem.name,
        quantity: shoppingItem.quantity,
        unit: shoppingItem.unit,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        minQuantity: 1,
      });

      await shoppingItem.deleteOne();

      return res.status(200).json({
        message: "Item moved to pantry",
      });
    }

    await shoppingItem.deleteOne();

    return res.status(200).json({
      message: "Item deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to process request",
    });
  }
});

export default router;
