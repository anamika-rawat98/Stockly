import {
  Container,
  Title,
  Text,
  TextInput,
  Badge,
  Group,
  Button,
  Card,
  ActionIcon,
  Tooltip,
  Modal,
  NumberInput,
  Stack,
  ThemeIcon,
  Loader,
  Alert,
} from "@mantine/core";
import Layout from "../components/Layout";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { DateInput, type DateValue } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconPlus,
  IconTrash,
  IconShoppingCart,
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconEdit,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getShoppingThunk,
  addShoppingThunk,
  updateShoppingThunk,
  purchaseShoppingThunk,
  deleteShoppingThunk,
} from "../store/thunks/shoppingThunk";
import type { ShoppingResponseData } from "../types/types";
import { clearError } from "../store/slice/shoppingSlice";

export default function ShoppingList() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.shopping);

  const [addModalOpened, { open: openAdd, close: closeAdd }] =
    useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [purchaseModalOpened, { open: openPurchase, close: closePurchase }] =
    useDisclosure(false);

  const [selectedItem, setSelectedItem] = useState<ShoppingResponseData | null>(
    null,
  );
  const [expiryDate, setExpiryDate] = useState<DateValue>(null);

  const addForm = useForm({
    initialValues: { name: "", quantity: 1, unit: "" },
    // ✅ clears API error when user starts typing
    onValuesChange: () => {
      if (error) dispatch(clearError());
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Item name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (/\d/.test(value)) return "Name cannot contain numbers";
        return null;
      },
      unit: (value) => {
        if (!value.trim()) return "Unit is required (e.g. kg, cans)";
        if (/\d/.test(value)) return "Unit cannot contain numbers";
        return null;
      },
      quantity: (value) => {
        if (!value || value < 1) return "Quantity must be at least 1";
        return null;
      },
    },
  });

  // ─── Edit Form ────────────────────────────────────────────
  const editForm = useForm({
    initialValues: { name: "", quantity: 1, unit: "" },
    // ✅ clears API error when user starts typing
    onValuesChange: () => {
      if (error) dispatch(clearError());
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Item name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (/\d/.test(value)) return "Name cannot contain numbers";
        return null;
      },
      unit: (value) => {
        if (!value.trim()) return "Unit is required (e.g. kg, cans)";
        if (/\d/.test(value)) return "Unit cannot contain numbers";
        return null;
      },
      quantity: (value) => {
        if (!value || value < 1) return "Quantity must be at least 1";
        return null;
      },
    },
  });

  useEffect(() => {
    dispatch(getShoppingThunk());
  }, [dispatch]);

  // ─── Add Item ─────────────────────────────────────────────
  const handleAdd = async () => {
    const validation = addForm.validate();
    if (validation.hasErrors) return;

    const result = await dispatch(
      addShoppingThunk({
        name: addForm.values.name.trim(),
        quantity: Number(addForm.values.quantity),
        unit: addForm.values.unit.trim(),
      }),
    );
    // ✅ only close on success — stays open on API error
    if (addShoppingThunk.fulfilled.match(result)) {
      notifications.show({
        title: "Item Added",
        message: `${addForm.values.name} added to shopping list!`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      addForm.reset();
      closeAdd();
    }
  };

  const handleCloseAdd = () => {
    if (error) dispatch(clearError());
    addForm.reset();
    closeAdd();
  };

  // ─── Edit Item ────────────────────────────────────────────
  const handleEditClick = (item: ShoppingResponseData) => {
    setSelectedItem(item);
    editForm.setValues({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
    });
    if (error) dispatch(clearError());
    openEdit();
  };

  const handleEditSave = async () => {
    const validation = editForm.validate();
    if (validation.hasErrors) return;
    if (!selectedItem) return;

    const result = await dispatch(
      updateShoppingThunk({
        id: selectedItem._id,
        data: {
          name: editForm.values.name.trim(),
          quantity: Number(editForm.values.quantity),
          unit: editForm.values.unit.trim(),
        },
      }),
    );
    // ✅ only close on success — stays open on API error
    if (updateShoppingThunk.fulfilled.match(result)) {
      notifications.show({
        title: "Item Updated",
        message: `${editForm.values.name} updated successfully!`,
        color: "blue",
        icon: <IconCheck size={16} />,
      });
      editForm.reset();
      closeEdit();
    }
  };

  const handleCloseEdit = () => {
    if (error) dispatch(clearError());
    editForm.reset();
    closeEdit();
  };

  // ─── Purchase ─────────────────────────────────────────────
  const handlePurchaseClick = (item: ShoppingResponseData) => {
    setSelectedItem(item);
    setExpiryDate(null);
    openPurchase();
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;

    let parsedExpiry: string | undefined = undefined;

    if (expiryDate) {
      parsedExpiry = new Date(expiryDate).toISOString();
    }

    const result = await dispatch(
      purchaseShoppingThunk({
        id: selectedItem._id,
        data: {
          expiryDate: parsedExpiry,
          ismoving: true,
        },
      }),
    );
    if (purchaseShoppingThunk.fulfilled.match(result)) {
      notifications.show({
        title: "Added to Pantry!",
        message: `${selectedItem.name} moved to your inventory`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      closePurchase();
      setSelectedItem(null);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (item: ShoppingResponseData) => {
    const result = await dispatch(deleteShoppingThunk(item._id));
    if (deleteShoppingThunk.fulfilled.match(result)) {
      notifications.show({
        title: "Item Removed",
        message: `${item.name} removed from shopping list`,
        color: "red",
        icon: <IconTrash size={16} />,
      });
    }
  };

  const autoAdded = items.filter((i) => i.isAutoAdded);
  const manual = items.filter((i) => !i.isAutoAdded);

  // ─── Item Row ─────────────────────────────────────────────
  const ItemRow = ({ item }: { item: ShoppingResponseData }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        item.isAutoAdded
          ? "bg-orange-50 border-orange-200"
          : "bg-white border-gray-200"
      }`}
    >
      <Tooltip
        label="Mark as Purchased → Add to Pantry"
        withArrow
        position="left"
      >
        <ActionIcon
          variant="filled"
          color="green"
          size="lg"
          radius="xl"
          className="shadow-sm hover:scale-110 transition-transform"
          onClick={() => handlePurchaseClick(item)}
        >
          <IconCheck size={18} stroke={2.5} />
        </ActionIcon>
      </Tooltip>

      <div className="flex-1 px-3">
        <Group gap="xs" align="center">
          <Text fw={500} size="sm" className="text-gray-800">
            {item.name}
          </Text>
          {item.isAutoAdded && (
            <Tooltip label="Added from low stock inventory">
              <Badge
                color="orange"
                variant="light"
                size="xs"
                leftSection={<IconAlertTriangle size={10} />}
              >
                Low Stock
              </Badge>
            </Tooltip>
          )}
        </Group>
        <Text size="xs" className="text-gray-400">
          {item.quantity} {item.unit}
        </Text>
      </div>

      <Group gap="xs">
        <Tooltip label="Edit">
          <ActionIcon
            variant="light"
            color="blue"
            size="md"
            onClick={() => handleEditClick(item)}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Remove">
          <ActionIcon
            variant="light"
            color="red"
            size="md"
            onClick={() => handleDelete(item)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  );

  return (
    <Layout>
      <Container size="md" className="py-8">
        <div className="mb-8 mt-4 text-center">
          <Group justify="center" gap="xs" mb={4}>
            <div className="p-2 bg-blue-50 rounded-lg">
              <IconShoppingCart size={20} className="text-blue-600" />
            </div>
            <Title order={1} className="text-2xl font-extrabold">
              Shopping List
            </Title>
          </Group>
          <Text className="text-gray-500 text-sm font-medium">
            Row stock items are added automatically
          </Text>
        </div>

        {/* Global Error Alert — only when no modal is open */}
        {error && !addModalOpened && !editModalOpened && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="filled"
            p="xs"
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 text-center bg-white/80! backdrop-blur-lg!"
          >
            <Text size="xl" fw={700} className="text-gray-900">
              {items.length}
            </Text>
            <Text size="xs" className="text-gray-500">
              Total
            </Text>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            className="border border-orange-200 text-center bg-white/80! backdrop-blur-lg!"
          >
            <Text size="xl" fw={700} className="text-orange-700">
              {autoAdded.length}
            </Text>
            <Text size="xs" className="text-orange-500">
              Low Stock
            </Text>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            className="border border-blue-200 text-center bg-white/80! backdrop-blur-lg!"
          >
            <Text size="xl" fw={700} className="text-blue-700">
              {manual.length}
            </Text>
            <Text size="xs" className="text-blue-500">
              Manual
            </Text>
          </Card>
        </div>

        {/* Action Bar */}
        <Group justify="flex-end" className="mb-4">
          <Button
            color="dark"
            size="md"
            leftSection={<IconPlus size={14} />}
            onClick={() => {
              addForm.reset();
              if (error) dispatch(clearError());
              openAdd();
            }}
          >
            Add Item
          </Button>
        </Group>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader color="dark" />
          </div>
        )}

        {/* Low Stock Items */}
        {!isLoading && autoAdded.length > 0 && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-orange-200 bg-white/40! backdrop-blur-lg! mb-4!"
          >
            <Group mb="md">
              <ThemeIcon color="orange" variant="light" size="sm">
                <IconAlertTriangle size={14} />
              </ThemeIcon>
              <Text fw={600} size="sm" className="text-orange-700">
                From Inventory (Low Stock / Expired)
              </Text>
            </Group>
            <Stack gap="xs">
              {autoAdded.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </Stack>
          </Card>
        )}

        {/* Manual Items */}
        {!isLoading && manual.length > 0 && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 bg-white/40! backdrop-blur-lg! mb-10!"
          >
            <Stack gap="xs">
              {manual.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </Stack>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 text-center py-12 bg-white/40! backdrop-blur-lg!"
          >
            <IconShoppingCart
              size={40}
              className="text-gray-300 mx-auto mb-3"
            />
            <Text fw={500} className="text-gray-500">
              Your shopping list is empty
            </Text>
            <Text size="sm" className="text-gray-400 mb-4">
              Add items manually or they'll appear here when pantry items run
              low
            </Text>
            <Button
              color="dark"
              leftSection={<IconPlus size={14} />}
              onClick={() => {
                addForm.reset();
                if (error) dispatch(clearError());
                openAdd();
              }}
            >
              Add First Item
            </Button>
          </Card>
        )}
      </Container>

      {/* ─── Add Modal ─────────────────────────────────────── */}
      <Modal
        opened={addModalOpened}
        onClose={handleCloseAdd}
        title={
          <Text fw={600} size="lg">
            Add to Shopping List
          </Text>
        }
        centered
        size="sm"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stack gap="sm">
          {/* ✅ API error inside modal — clears on typing */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="filled"
              p="xs"
            >
              {error}
            </Alert>
          )}
          <TextInput
            label="Item Name"
            placeholder="e.g. Olive Oil"
            {...addForm.getInputProps("name")}
            required
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              min={1}
              {...addForm.getInputProps("quantity")}
            />
            <TextInput
              label="Unit"
              placeholder="e.g. kg, cans"
              {...addForm.getInputProps("unit")}
              required
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleCloseAdd}>
              Cancel
            </Button>
            <Button
              color="dark"
              leftSection={<IconCheck size={16} />}
              onClick={handleAdd}
              loading={isLoading}
            >
              Add to List
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ─── Edit Modal ────────────────────────────────────── */}
      <Modal
        opened={editModalOpened}
        onClose={handleCloseEdit}
        title={
          <Text fw={600} size="lg">
            Edit Item
          </Text>
        }
        centered
        size="sm"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stack gap="sm">
          {/* ✅ API error inside modal — clears on typing */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="filled"
              p="xs"
            >
              {error}
            </Alert>
          )}
          <TextInput
            label="Item Name"
            placeholder="e.g. Olive Oil"
            {...editForm.getInputProps("name")}
            required
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              min={1}
              {...editForm.getInputProps("quantity")}
            />
            <TextInput
              label="Unit"
              placeholder="e.g. kg, cans"
              {...editForm.getInputProps("unit")}
              required
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button
              color="blue"
              leftSection={<IconCheck size={16} />}
              onClick={handleEditSave}
              loading={isLoading}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ─── Purchase Modal ────────────────────────────────── */}
      <Modal
        opened={purchaseModalOpened}
        onClose={closePurchase}
        title={
          <Text fw={600} size="lg">
            Add to Pantry
          </Text>
        }
        centered
        size="sm"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stack gap="sm">
          <Text size="sm" className="text-gray-600">
            You're adding <strong>{selectedItem?.name}</strong> back to your
            pantry. Enter the expiry date if you know it!
          </Text>
          <DateInput
            label="Expiry Date"
            placeholder="Pick a date (Optional)"
            value={expiryDate}
            onChange={setExpiryDate}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={closePurchase}>
              Cancel
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={14} />}
              onClick={handleConfirmPurchase}
              loading={isLoading}
            >
              Add to Pantry
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Layout>
  );
}
