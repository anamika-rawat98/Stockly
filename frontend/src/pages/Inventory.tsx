import {
  Container,
  Title,
  Text,
  TextInput,
  Badge,
  Table,
  Group,
  Button,
  Select,
  Card,
  Progress,
  ActionIcon,
  Tooltip,
  Modal,
  NumberInput,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateInput, type DateValue } from "@mantine/dates";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconFilter,
  IconAlertTriangle,
  IconPackage,
  IconCalendarX,
  IconCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import Layout from "../components/Layout";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  minQuantity: number;
};

const mockItems: InventoryItem[] = [
  {
    id: 1,
    name: "Basmati Rice",
    category: "Grains",
    quantity: 3,
    unit: "kg",
    expiryDate: "2025-12-01",
    minQuantity: 2,
  },
  {
    id: 2,
    name: "Olive Oil",
    category: "Oils",
    quantity: 1,
    unit: "bottle",
    expiryDate: "2025-03-15",
    minQuantity: 2,
  },
  {
    id: 3,
    name: "Canned Tomatoes",
    category: "Canned",
    quantity: 6,
    unit: "cans",
    expiryDate: "2026-06-30",
    minQuantity: 3,
  },
  {
    id: 4,
    name: "Whole Wheat Pasta",
    category: "Grains",
    quantity: 2,
    unit: "packs",
    expiryDate: "2025-02-20",
    minQuantity: 2,
  },
  {
    id: 5,
    name: "Chickpeas",
    category: "Legumes",
    quantity: 4,
    unit: "cans",
    expiryDate: "2026-01-10",
    minQuantity: 2,
  },
  {
    id: 6,
    name: "Soy Sauce",
    category: "Condiments",
    quantity: 1,
    unit: "bottle",
    expiryDate: "2025-08-05",
    minQuantity: 1,
  },
  {
    id: 7,
    name: "Black Beans",
    category: "Legumes",
    quantity: 5,
    unit: "cans",
    expiryDate: "2026-03-22",
    minQuantity: 2,
  },
  {
    id: 8,
    name: "Almond Milk",
    category: "Dairy Alt",
    quantity: 2,
    unit: "cartons",
    expiryDate: "2025-02-10",
    minQuantity: 2,
  },
];

function getExpiryStatus(expiryDate: string) {
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
  const ratio = quantity / minQuantity;
  if (quantity === 0) return { label: "Out of stock", color: "red" };
  if (ratio <= 1) return { label: "Low stock", color: "orange" };
  return { label: "In stock", color: "green" };
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const [form, setForm] = useState<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expiryDate: DateValue;
    minQuantity: number;
  }>({
    name: "",
    category: "",
    quantity: 1,
    unit: "",
    expiryDate: null,
    minQuantity: 1,
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const expiringSoon = items.filter((i) => {
    const { days } = getExpiryStatus(i.expiryDate);
    return days <= 7;
  }).length;

  const lowStock = items.filter((i) => i.quantity <= i.minQuantity).length;

  const handleDelete = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
      minQuantity: item.minQuantity,
    });
    open();
  };

  const toDateString = (val: DateValue): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().split("T")[0];
    return val;
  };

  const handleSave = () => {
    if (editItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? {
                ...i,
                ...form,
                expiryDate: toDateString(form.expiryDate) || i.expiryDate,
              }
            : i,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          quantity: Number(form.quantity),
          minQuantity: Number(form.minQuantity),
          expiryDate: toDateString(form.expiryDate),
        },
      ]);
    }
    setEditItem(null);
    setForm({
      name: "",
      category: "",
      quantity: 1,
      unit: "",
      expiryDate: null,
      minQuantity: 1,
    });
    close();
  };

  return (
    <Layout>
      <Container size="xl" className="py-8">
        {/* Page Title */}
        <div className="my-10 text-center">
          <Title order={1} className="text-3xl font-bold text-gray-900">
            Pantry Inventory
          </Title>
          <Text className="text-gray-500 mt-1">
            Track your ingredients, quantities and expiry dates
          </Text>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 bg-white/40! backdrop-blur-lg!"
          >
            <Group>
              <div className=" p-3 rounded-lg">
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
            className="border border-orange-200 bg-white/40! backdrop-blur-lg!"
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
            className="border border-red-200 bg-white/40! backdrop-blur-lg!"
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

        {/* Search + Filter + Add */}
        <Card
          shadow="xs"
          radius="md"
          className="border border-gray-200 mb-6 bg-white/40! backdrop-blur-lg!"
        >
          <Group justify="space-between" wrap="wrap" gap="sm">
            <Group gap="sm" className="flex-1">
              <TextInput
                placeholder="Search ingredients..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-50 "
              />
              <Select
                placeholder="All Categories"
                leftSection={<IconFilter size={16} />}
                data={categories}
                value={categoryFilter}
                onChange={setCategoryFilter}
                clearable
                className="w-48"
              />
            </Group>
            <Button
              leftSection={<IconPlus size={16} />}
              color="black"
              onClick={() => {
                setEditItem(null);
                setForm({
                  name: "",
                  category: "",
                  quantity: 1,
                  unit: "",
                  expiryDate: null,
                  minQuantity: 1,
                });
                open();
              }}
            >
              Add Item
            </Button>
          </Group>
        </Card>

        {/* Table */}
        <Card
          shadow="xs"
          radius="md"
          className="border border-gray-200 overflow-x-auto bg-white/60! backdrop-blur-lg! mb-20!"
        >
          <Table verticalSpacing="md">
            <Table.Thead>
              <Table.Tr className="bg-gray-50">
                <Table.Th className="text-gray-600 font-semibold">
                  Name
                </Table.Th>
                <Table.Th className="text-gray-600 font-semibold">
                  Category
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

                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text fw={500} className="text-gray-900">
                        {item.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" size="sm">
                        {item.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={600} className="text-gray-800">
                          {item.quantity} {item.unit}
                        </Text>
                        <Progress
                          value={stockPercent}
                          color={stock.color}
                          size="xs"
                          className="mt-1 w-24"
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
                        <Tooltip label="Edit">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleEdit(item)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDelete(item.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}

              {filtered.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text className="text-center text-gray-400 py-8">
                      No items found. Try a different search.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      </Container>

      {/* Add / Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={close}
        title={
          <Title order={4}>{editItem ? "Edit Item" : "Add New Item"}</Title>
        }
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
        size="md"
      >
        <Stack gap="sm">
          <TextInput
            label="Item Name"
            placeholder="e.g. Basmati Rice"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Group grow>
            <TextInput
              label="Category"
              placeholder="e.g. Grains"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <TextInput
              label="Unit"
              placeholder="e.g. kg, cans"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Quantity"
              min={0}
              value={form.quantity}
              onChange={(val) =>
                setForm({ ...form, quantity: Number(val) || 0 })
              }
            />
            <NumberInput
              label="Min Quantity (alert threshold)"
              min={1}
              value={form.minQuantity}
              onChange={(val) =>
                setForm({ ...form, minQuantity: Number(val) || 1 })
              }
            />
          </Group>
          <DateInput
            label="Expiry Date"
            placeholder="Pick a date"
            value={form.expiryDate}
            onChange={(val) => setForm({ ...form, expiryDate: val })}
            minDate={new Date()}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={16} />}
              onClick={handleSave}
              disabled={!form.name}
            >
              {editItem ? "Save Changes" : "Add Item"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Layout>
  );
}
