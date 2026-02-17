import {
  Container,
  Title,
  Text,
  TextInput,
  Badge,
  Table,
  Group,
  Button,
  Card,
  Progress,
  ActionIcon,
  Tooltip,
  Modal,
  NumberInput,
  Stack,
  Loader,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { DateInput, type DateValue } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconPackage,
  IconCalendarX,
  IconCheck,
  IconAlertCircle,
  IconShoppingCart,
  IconMinus,
  IconPencil,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getInventoryThunk,
  addInventoryThunk,
  updateInventoryThunk,
  deleteInventoryThunk,
} from "../store/thunks/inventoryThunk";
import { addShoppingThunk } from "../store/thunks/shoppingThunk";
import type { InventoryResponseData, InventoryData } from "../types/types";
import Layout from "../components/Layout";
import { clearError } from "../store/slice/inventorySlice";

function getExpiryStatus(expiryDate?: string | Date) {
  if (!expiryDate) return { label: "No expiry", color: "gray", days: Infinity };
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysLeft <= 0) return { label: "Expired", color: "red", days: daysLeft };
  if (daysLeft <= 7)
    return { label: `${daysLeft}d left`, color: "red", days: daysLeft };
  if (daysLeft <= 30)
    return { label: `${daysLeft}d left`, color: "orange", days: daysLeft };
  return { label: `${daysLeft}d left`, color: "green", days: daysLeft };
}

function getStockStatus(quantity: number, minQuantity: number) {
  if (quantity === 0) return { label: "Out of stock", color: "red" };
  if (quantity <= minQuantity) return { label: "Low stock", color: "orange" };
  return { label: "In stock", color: "green" };
}

export default function Inventory() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.inventory,
  );

  const [search, setSearch] = useState("");
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editItem, setEditItem] = useState<InventoryResponseData | null>(null);

  // ─── Inline quantity update ───────────────────────────────
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ─── Quantity modal (clickable number) ───────────────────
  const [qtyModalOpened, { open: openQtyModal, close: closeQtyModal }] =
    useDisclosure(false);
  const [qtyItem, setQtyItem] = useState<InventoryResponseData | null>(null);
  const [newQtyValue, setNewQtyValue] = useState<number>(0);
  const [qtyLoading, setQtyLoading] = useState(false);

  // ─── Shopping modal ───────────────────────────────────────
  const [shoppingModalOpened, { open: openShopping, close: closeShopping }] =
    useDisclosure(false);
  const [shoppingItem, setShoppingItem] =
    useState<InventoryResponseData | null>(null);
  const [shoppingQty, setShoppingQty] = useState<number>(1);
  const [shoppingLoading, setShoppingLoading] = useState(false);

  // ─── Edit form (no quantity) ──────────────────────────────
  const form = useForm({
    initialValues: {
      name: "",
      unit: "",
      expiryDate: null as DateValue,
      minQuantity: 1,
    },
    onValuesChange: () => {
      if (error) dispatch(clearError());
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Item name is required";
        if (/\d/.test(value)) return "Name cannot contain numbers";
        return null;
      },
      unit: (value) => {
        if (!value.trim()) return "Unit is required";
        if (/\d/.test(value)) return "Unit cannot contain numbers";
        return null;
      },
      minQuantity: (value) => {
        if (value <= 0) return "Min quantity must be greater than 0";
        return null;
      },
    },
  });

  // ─── Add form (has quantity) ──────────────────────────────
  const addForm = useForm({
    initialValues: {
      name: "",
      quantity: 1,
      unit: "",
      expiryDate: null as DateValue,
      minQuantity: 1,
    },
    onValuesChange: () => {
      if (error) dispatch(clearError());
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Item name is required";
        if (/\d/.test(value)) return "Name cannot contain numbers";
        return null;
      },
      unit: (value) => {
        if (!value.trim()) return "Unit is required";
        if (/\d/.test(value)) return "Unit cannot contain numbers";
        return null;
      },
      quantity: (value) => {
        if (value <= 0) return "Quantity must be greater than 0";
        return null;
      },
      minQuantity: (value) => {
        if (value <= 0) return "Min quantity must be greater than 0";
        return null;
      },
    },
  });

  useEffect(() => {
    dispatch(getInventoryThunk());
  }, [dispatch]);

  const filtered = items.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const expiringSoon = items.filter((i) => {
    const { days } = getExpiryStatus(i.expiryDate);
    return days !== Infinity && days <= 7;
  }).length;

  const lowStock = items.filter((i) => i.quantity <= i.minQuantity).length;

  const toDateString = (val: DateValue): string | undefined => {
    if (!val) return undefined;
    if (val instanceof Date) return val.toISOString();
    return val;
  };

  const handleCloseModal = () => {
    if (error) dispatch(clearError());
    form.reset();
    addForm.reset();
    setEditItem(null);
    close();
  };

  // ─── Inline ±1 quick update ───────────────────────────────
  const handleQuantityChange = async (
    item: InventoryResponseData,
    delta: number,
  ) => {
    const newQty = Math.max(0, item.quantity + delta);
    setUpdatingId(item._id);
    try {
      const result = await dispatch(
        updateInventoryThunk({
          id: item._id,
          data: {
            name: item.name,
            unit: item.unit,
            minQuantity: item.minQuantity,
            expiryDate: toDateString(item.expiryDate as DateValue),
            quantity: newQty,
          },
        }),
      );
      if (updateInventoryThunk.fulfilled.match(result)) {
        if (newQty === 0) {
          notifications.show({
            title: "Out of stock!",
            message: `${item.name} is now out of stock`,
            color: "red",
            icon: <IconAlertTriangle size={16} />,
          });
        } else if (newQty <= item.minQuantity && delta < 0) {
          notifications.show({
            title: "Low stock",
            message: `${item.name} is running low — ${newQty} ${item.unit} left`,
            color: "orange",
            icon: <IconAlertTriangle size={16} />,
          });
        }
        dispatch(getInventoryThunk());
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Open quantity modal (click on number) ────────────────
  const handleOpenQtyModal = (item: InventoryResponseData) => {
    setQtyItem(item);
    setNewQtyValue(item.quantity);
    openQtyModal();
  };

  // ─── Confirm quantity modal update ────────────────────────
  const handleConfirmQtyUpdate = async () => {
    if (!qtyItem) return;
    setQtyLoading(true);
    try {
      const result = await dispatch(
        updateInventoryThunk({
          id: qtyItem._id,
          data: {
            name: qtyItem.name,
            unit: qtyItem.unit,
            minQuantity: qtyItem.minQuantity,
            expiryDate: toDateString(qtyItem.expiryDate as DateValue),
            quantity: Math.max(0, newQtyValue),
          },
        }),
      );
      if (updateInventoryThunk.fulfilled.match(result)) {
        const finalQty = Math.max(0, newQtyValue);
        if (finalQty === 0) {
          notifications.show({
            title: "Out of stock!",
            message: `${qtyItem.name} is now out of stock`,
            color: "red",
            icon: <IconAlertTriangle size={16} />,
          });
        } else if (finalQty <= qtyItem.minQuantity) {
          notifications.show({
            title: "Low stock",
            message: `${qtyItem.name} is running low — ${finalQty} ${qtyItem.unit} left`,
            color: "orange",
            icon: <IconAlertTriangle size={16} />,
          });
        } else {
          notifications.show({
            title: "Quantity updated",
            message: `${qtyItem.name}: ${finalQty} ${qtyItem.unit}`,
            color: "green",
            icon: <IconCheck size={16} />,
          });
        }
        dispatch(getInventoryThunk());
        closeQtyModal();
        setQtyItem(null);
      }
    } finally {
      setQtyLoading(false);
    }
  };

  // ─── Edit item details ────────────────────────────────────
  const handleEdit = (item: InventoryResponseData) => {
    setEditItem(item);
    form.setValues({
      name: item.name,
      unit: item.unit,
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
      minQuantity: item.minQuantity,
    });
    open();
  };

  const handleDelete = async (item: InventoryResponseData) => {
    const result = await dispatch(deleteInventoryThunk(item._id));
    if (deleteInventoryThunk.fulfilled.match(result)) {
      notifications.show({
        title: "Item Deleted",
        message: `${item.name} was removed from your pantry`,
        color: "red",
        icon: <IconTrash size={16} />,
      });
      dispatch(getInventoryThunk());
    }
  };

  const handleSave = async () => {
    if (editItem) {
      const validation = form.validate();
      if (validation.hasErrors) return;

      const data: InventoryData = {
        name: form.values.name,
        quantity: editItem.quantity, // keep existing quantity
        unit: form.values.unit,
        minQuantity: Number(form.values.minQuantity),
        expiryDate: (toDateString(form.values.expiryDate) ?? "") as string,
      };

      const result = await dispatch(
        updateInventoryThunk({ id: editItem._id, data }),
      );
      if (updateInventoryThunk.fulfilled.match(result)) {
        notifications.show({
          title: "Item Updated",
          message: `${form.values.name} was updated successfully!`,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        dispatch(getInventoryThunk());
        handleCloseModal();
      }
    } else {
      const validation = addForm.validate();
      if (validation.hasErrors) return;

      const data: InventoryData = {
        name: addForm.values.name,
        quantity: Number(addForm.values.quantity),
        unit: addForm.values.unit,
        minQuantity: Number(addForm.values.minQuantity),
        expiryDate: (toDateString(addForm.values.expiryDate) ?? "") as string,
      };

      const result = await dispatch(addInventoryThunk(data));
      if (addInventoryThunk.fulfilled.match(result)) {
        notifications.show({
          title: "Item Added",
          message: `${addForm.values.name} was added to your pantry!`,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        dispatch(getInventoryThunk());
        handleCloseModal();
      }
    }
  };

  // ─── Shopping list ────────────────────────────────────────
  const handleOpenShopping = (item: InventoryResponseData) => {
    setShoppingItem(item);
    setShoppingQty(1);
    openShopping();
  };

  const handleConfirmShopping = async () => {
    if (!shoppingItem) return;
    setShoppingLoading(true);
    try {
      const result = await dispatch(
        addShoppingThunk({
          inventoryItemId: shoppingItem._id,
          quantity: shoppingQty,
        }),
      );
      if (addShoppingThunk.fulfilled.match(result)) {
        notifications.show({
          title: "Added to Shopping List!",
          message: `${shoppingItem.name} added to your shopping list`,
          color: "orange",
          icon: <IconShoppingCart size={16} />,
        });
        dispatch(getInventoryThunk());
        closeShopping();
        setShoppingItem(null);
      }
    } finally {
      setShoppingLoading(false);
    }
  };

  // live preview color in qty modal
  const remainingColor =
    newQtyValue === 0
      ? "#dc2626"
      : newQtyValue <= (qtyItem?.minQuantity ?? 0)
        ? "#ea580c"
        : "#16a34a";

  return (
    <Layout>
      <Container size="xl" className="py-8">
        <div className="mb-8 mt-4 text-center">
          <Group justify="center" gap="xs" mb={4}>
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
              <IconPackage size={20} className="text-blue-600" />
            </div>
            <Title order={1} className="text-2xl font-extrabold">
              Pantry Inventory
            </Title>
          </Group>
          <Text className="text-gray-500 text-sm font-medium">
            Track your ingredients, quantities and expiry dates
          </Text>
        </div>

        {/* Global Error Alert */}
        {error && !modalOpened && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="filled"
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 bg-white/90! backdrop-blur-lg!"
          >
            <Group>
              <div className="p-3 rounded-lg">
                <IconPackage size={24} className="text-blue-600" />
              </div>
              <div>
                <Text size="sm" className="text-gray-500">
                  Total Items
                </Text>
                <Title order={3} className="text-gray-900">
                  {items.length}
                </Title>
              </div>
            </Group>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            className="border border-orange-200 bg-white/80! backdrop-blur-lg!"
          >
            <Group>
              <div className="p-3 rounded-lg">
                <IconAlertTriangle size={24} className="text-orange-600" />
              </div>
              <div>
                <Text size="sm" className="text-orange-600">
                  Low Stock
                </Text>
                <Title order={3} className="text-orange-700">
                  {lowStock}
                </Title>
              </div>
            </Group>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            className="border border-red-200 bg-white/80! backdrop-blur-lg!"
          >
            <Group>
              <div className="p-3 rounded-lg">
                <IconCalendarX size={24} className="text-red-600" />
              </div>
              <div>
                <Text size="sm" className="text-red-600">
                  Expiring Soon
                </Text>
                <Title order={3} className="text-red-700">
                  {expiringSoon}
                </Title>
              </div>
            </Group>
          </Card>
        </div>

        {/* Search + Add */}
        <Card
          shadow="xs"
          radius="md"
          className="border border-gray-200 mb-6 bg-white/80! backdrop-blur-lg!"
        >
          <Group justify="space-between" wrap="wrap" gap="sm">
            <TextInput
              placeholder="Search ingredients..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-50"
            />
            <Button
              leftSection={<IconPlus size={16} />}
              color="dark"
              onClick={() => {
                setEditItem(null);
                addForm.reset();
                form.reset();
                if (error) dispatch(clearError());
                open();
              }}
            >
              Add Item
            </Button>
          </Group>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader color="dark" />
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 overflow-x-auto bg-white/90! backdrop-blur-xl! mb-20!"
          >
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr className="bg-gray-50">
                  <Table.Th className="text-gray-600 font-semibold">
                    Name
                  </Table.Th>
                  <Table.Th className="text-gray-600 font-semibold">
                    Quantity
                  </Table.Th>
                  <Table.Th className="text-gray-600 font-semibold">
                    Stock
                  </Table.Th>
                  <Table.Th className="text-gray-600 font-semibold">
                    Expiry
                  </Table.Th>
                  <Table.Th className="text-gray-600 font-semibold">
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map((item) => {
                  const expiry = getExpiryStatus(item.expiryDate);
                  const stock = getStockStatus(item.quantity, item.minQuantity);
                  const stockPercent = Math.min(
                    (item.quantity / (item.minQuantity * 2)) * 100,
                    100,
                  );
                  const isUpdating = updatingId === item._id;

                  return (
                    <Table.Tr key={item._id}>
                      <Table.Td>
                        <Text fw={500} className="text-gray-900">
                          {item.name}
                        </Text>
                      </Table.Td>

                      {/* ✅ Hybrid quantity column */}
                      <Table.Td>
                        <div>
                          <Group gap={4} mb={4} align="center">
                            {/* Quick -1 */}
                            <Tooltip label="Decrease by 1">
                              <ActionIcon
                                size="xs"
                                variant="light"
                                color="red"
                                radius="xl"
                                disabled={item.quantity === 0 || isUpdating}
                                onClick={() => handleQuantityChange(item, -1)}
                              >
                                <IconMinus size={10} />
                              </ActionIcon>
                            </Tooltip>

                            {/* ✅ Clickable quantity number — opens modal */}
                            <Tooltip label="Click to set exact amount">
                              <button
                                onClick={() => handleOpenQtyModal(item)}
                                disabled={isUpdating}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-600 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200 min-w-16 justify-center"
                              >
                                {isUpdating ? (
                                  <Text size="xs" c="dimmed">
                                    ...
                                  </Text>
                                ) : (
                                  <>
                                    <Text size="sm" fw={600}>
                                      {item.quantity} {item.unit}
                                    </Text>
                                    <IconPencil
                                      size={10}
                                      className="text-gray-400"
                                    />
                                  </>
                                )}
                              </button>
                            </Tooltip>

                            {/* Quick +1 */}
                            <Tooltip label="Increase by 1">
                              <ActionIcon
                                size="xs"
                                variant="light"
                                color="green"
                                radius="xl"
                                disabled={isUpdating}
                                onClick={() => handleQuantityChange(item, +1)}
                              >
                                <IconPlus size={10} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                          <Progress
                            value={stockPercent}
                            color={stock.color}
                            size="xs"
                            className="w-28"
                          />
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <Badge color={stock.color} variant="light" size="sm">
                          {stock.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={expiry.color} variant="light" size="sm">
                          {expiry.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {(stock.label === "Low stock" ||
                            stock.label === "Out of stock" ||
                            expiry.label === "Expired") && (
                            <Tooltip label="Add to Shopping List">
                              <ActionIcon
                                variant="light"
                                color="orange"
                                onClick={() => handleOpenShopping(item)}
                              >
                                <IconShoppingCart size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          <Tooltip label="Edit details">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="md"
                              onClick={() => handleEdit(item)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
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
                      </Table.Td>
                    </Table.Tr>
                  );
                })}

                {filtered.length === 0 && !isLoading && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text className="text-center text-gray-400 py-8">
                        {search
                          ? "No items match your search."
                          : "No items yet. Add your first pantry item!"}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        )}
      </Container>

      {/* ─── Quantity Update Modal ──────────────────────────── */}
      <Modal
        opened={qtyModalOpened}
        onClose={() => {
          closeQtyModal();
          setQtyItem(null);
        }}
        title={
          <Text fw={600} size="lg">
            Update Quantity
          </Text>
        }
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
        size="xs"
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" className="text-gray-500">
              Item
            </Text>
            <Text size="sm" fw={600} className="text-gray-800">
              {qtyItem?.name}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" className="text-gray-500">
              Current stock
            </Text>
            <Text size="sm" fw={600} className="text-gray-800">
              {qtyItem?.quantity} {qtyItem?.unit}
            </Text>
          </Group>

          <NumberInput
            label={`New quantity (${qtyItem?.unit})`}
            min={0}
            value={newQtyValue}
            onChange={(val) => setNewQtyValue(Number(val) ?? 0)}
            autoFocus
          />

          {/* ✅ Live preview of what will remain */}
          <div className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200">
            <Group justify="space-between">
              <Text size="xs" className="text-gray-500">
                After update
              </Text>
              <Text size="sm" fw={700} style={{ color: remainingColor }}>
                {Math.max(0, newQtyValue)} {qtyItem?.unit}
                {newQtyValue === 0 && " — Out of stock"}
                {newQtyValue > 0 &&
                  newQtyValue <= (qtyItem?.minQuantity ?? 0) &&
                  " — Low stock"}
                {newQtyValue > (qtyItem?.minQuantity ?? 0) && " — In stock"}
              </Text>
            </Group>
          </div>

          <Group justify="flex-end" mt="xs">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                closeQtyModal();
                setQtyItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="dark"
              leftSection={<IconCheck size={16} />}
              onClick={handleConfirmQtyUpdate}
              loading={qtyLoading}
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ─── Add / Edit Modal ──────────────────────────────── */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={
          <Text fw={600} size="lg">
            {editItem ? "Edit Item Details" : "Add New Item"}
          </Text>
        }
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
        size="md"
      >
        <Stack gap="sm">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {editItem ? (
            /* ✅ Edit */
            <>
              <TextInput
                label="Item Name"
                placeholder="e.g. Basmati Rice"
                {...form.getInputProps("name")}
                required
              />
              <TextInput
                label="Unit"
                placeholder="e.g. kg, cans, bottles"
                {...form.getInputProps("unit")}
                required
              />
              <NumberInput
                label="Min Quantity Alert"
                description="You'll see a low stock warning below this number"
                min={1}
                {...form.getInputProps("minQuantity")}
              />
              <DateInput
                label="Expiry Date"
                placeholder="Pick a date"
                value={form.values.expiryDate}
                onChange={(val) => form.setFieldValue("expiryDate", val)}
              />
            </>
          ) : (
            /* ✅ Add — has quantity */
            <>
              <TextInput
                label="Item Name"
                placeholder="e.g. Basmati Rice"
                {...addForm.getInputProps("name")}
                required
              />
              <TextInput
                label="Unit"
                placeholder="e.g. kg, cans, bottles"
                {...addForm.getInputProps("unit")}
                required
              />
              <Group grow>
                <NumberInput
                  label="Quantity"
                  min={1}
                  {...addForm.getInputProps("quantity")}
                />
                <NumberInput
                  label="Min Quantity Alert"
                  min={1}
                  {...addForm.getInputProps("minQuantity")}
                />
              </Group>
              <DateInput
                label="Expiry Date"
                placeholder="Pick a date"
                value={addForm.values.expiryDate}
                onChange={(val) => addForm.setFieldValue("expiryDate", val)}
              />
            </>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="dark"
              leftSection={<IconCheck size={16} />}
              onClick={handleSave}
              loading={isLoading}
            >
              {editItem ? "Save Changes" : "Add Item"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ─── Add to Shopping List Modal ────────────────────── */}
      <Modal
        opened={shoppingModalOpened}
        onClose={() => {
          closeShopping();
          setShoppingItem(null);
        }}
        title={
          <Text fw={600} size="lg">
            Add to Shopping List
          </Text>
        }
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        centered
        size="sm"
      >
        <Stack gap="sm">
          <Text size="sm" className="text-gray-600">
            How much <strong>{shoppingItem?.name}</strong> do you need to buy?{" "}
            (Current stock:{" "}
            <strong>
              {shoppingItem?.quantity} {shoppingItem?.unit}
            </strong>
            )
          </Text>
          <NumberInput
            label={`Quantity to buy (${shoppingItem?.unit})`}
            min={1}
            value={shoppingQty}
            onChange={(val) => setShoppingQty(Number(val) || 1)}
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                closeShopping();
                setShoppingItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="orange"
              leftSection={<IconShoppingCart size={16} />}
              onClick={handleConfirmShopping}
              loading={shoppingLoading}
            >
              Add to Shopping List
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Layout>
  );
}
