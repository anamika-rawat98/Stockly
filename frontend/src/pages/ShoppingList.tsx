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
  Checkbox,
  Select,
  ThemeIcon,
  Progress,
} from "@mantine/core";
import Layout from "../components/Layout";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconTrash,
  IconShoppingCart,
  IconCheck,
  IconAlertTriangle,
  IconPackage,
  IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";

type ShoppingItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
  isAutoAdded: boolean; // came from low stock in inventory
};

// These would come from inventory low stock items in real app
const autoAddedItems: ShoppingItem[] = [
  {
    id: 1,
    name: "Olive Oil",
    quantity: 2,
    unit: "bottle",
    category: "Oils",
    isPurchased: false,
    isAutoAdded: true,
  },
  {
    id: 2,
    name: "Almond Milk",
    quantity: 3,
    unit: "cartons",
    category: "Dairy Alt",
    isPurchased: false,
    isAutoAdded: true,
  },
  {
    id: 3,
    name: "Whole Wheat Pasta",
    quantity: 2,
    unit: "packs",
    category: "Grains",
    isPurchased: false,
    isAutoAdded: true,
  },
];

const manualItems: ShoppingItem[] = [
  {
    id: 4,
    name: "Greek Yogurt",
    quantity: 2,
    unit: "cups",
    category: "Dairy",
    isPurchased: false,
    isAutoAdded: false,
  },
  {
    id: 5,
    name: "Bananas",
    quantity: 6,
    unit: "pcs",
    category: "Fruits",
    isPurchased: true,
    isAutoAdded: false,
  },
];

const CATEGORIES = [
  "Grains",
  "Legumes",
  "Canned",
  "Oils",
  "Condiments",
  "Dairy Alt",
  "Dairy",
  "Fruits",
  "Vegetables",
  "Snacks",
  "Beverages",
  "Other",
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([
    ...autoAddedItems,
    ...manualItems,
  ]);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    unit: "",
    category: "Other",
  });

  const pending = items.filter((i) => !i.isPurchased);
  const purchased = items.filter((i) => i.isPurchased);
  const progress =
    items.length > 0 ? Math.round((purchased.length / items.length) * 100) : 0;

  const handleToggle = (id: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, isPurchased: !i.isPurchased } : i,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        quantity: Number(form.quantity) || 1,
        isPurchased: false,
        isAutoAdded: false,
      },
    ]);
    setForm({ name: "", quantity: 1, unit: "", category: "Other" });
    close();
  };

  const handleClearPurchased = () => {
    setItems((prev) => prev.filter((i) => !i.isPurchased));
  };

  const ItemRow = ({ item }: { item: ShoppingItem }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        item.isPurchased
          ? "bg-gray-50 border-gray-200 opacity-60"
          : item.isAutoAdded
            ? "bg-orange-50 border-orange-200"
            : "bg-white border-gray-200"
      }`}
    >
      <Group gap="sm" className="flex-1">
        <Checkbox
          checked={item.isPurchased}
          onChange={() => handleToggle(item.id)}
          color="green"
          radius="xl"
        />
        <div className="flex-1">
          <Group gap="xs" align="center">
            <Text
              fw={500}
              size="sm"
              className={
                item.isPurchased
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }
            >
              {item.name}
            </Text>
            {item.isAutoAdded && !item.isPurchased && (
              <Tooltip label="Auto-added from low stock">
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
            {item.quantity} {item.unit} · {item.category}
          </Text>
        </div>
      </Group>

      <Group gap="xs">
        {item.isPurchased && (
          <Tooltip label="Mark as not purchased">
            <ActionIcon
              variant="light"
              color="gray"
              size="sm"
              onClick={() => handleToggle(item.id)}
            >
              <IconRefresh size={14} />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label="Remove">
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  );

  return (
    <Layout>
      <Container size="md" className="py-8">
        {/* Page Title */}
        <div className="my-10 text-center">
          <Title order={1} className="text-3xl font-bold text-gray-900">
            Shopping List
          </Title>
          <Text className="text-gray-500 mt-1">
            Items to buy — low stock items are added automatically
          </Text>
        </div>

        {/* Progress Card */}
        <Card
          shadow="xs"
          radius="md"
          className="border border-gray-200 mb-6 bg-white/40! backdrop-blur-lg!"
        >
          <Group justify="space-between" mb="xs">
            <Group gap="sm">
              <ThemeIcon color="green" size="md">
                <IconShoppingCart size={16} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="sm" className="text-gray-800">
                  {purchased.length} of {items.length} items purchased
                </Text>
                <Text size="xs" className="text-gray-400">
                  {pending.length} remaining
                </Text>
              </div>
            </Group>
            {progress === 100 && (
              <Badge
                color="green"
                variant="light"
                leftSection={<IconCheck size={12} />}
              >
                All done!
              </Badge>
            )}
          </Group>
          <Progress value={progress} color="green" radius="xl" size="md" />
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 text-center bg-white/40! backdrop-blur-lg!"
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
            className="border border-orange-200 text-center bg-white/40! backdrop-blur-lg!"
          >
            <Text size="xl" fw={700} className="text-orange-700">
              {items.filter((i) => i.isAutoAdded && !i.isPurchased).length}
            </Text>
            <Text size="xs" className="text-orange-500">
              Low Stock
            </Text>
          </Card>
          <Card
            shadow="xs"
            radius="md"
            className="border border-green-200 text-center bg-white/40! backdrop-blur-lg!"
          >
            <Text size="xl" fw={700} className="text-green-700">
              {purchased.length}
            </Text>
            <Text size="xs" className="text-green-500">
              Purchased
            </Text>
          </Card>
        </div>

        {/* Action Bar */}
        <Group justify="space-between" className="mb-4">
          <Text fw={600} className="text-gray-700">
            {pending.length > 0
              ? `${pending.length} items to buy`
              : "Nothing left to buy 🎉"}
          </Text>
          <Group gap="sm">
            {purchased.length > 0 && (
              <Button
                variant="subtle"
                color="white"
                leftSection={<IconTrash size={18} />}
                onClick={handleClearPurchased}
              >
                Clear purchased
              </Button>
            )}
            <Button
              color="black"
              size="md"
              leftSection={<IconPlus size={14} />}
              onClick={open}
            >
              Add Item
            </Button>
          </Group>
        </Group>

        {/* Pending Items */}
        {pending.length > 0 && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 bg-white/40! backdrop-blur-lg! mb-10!"
          >
            <Group mb="md">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconPackage size={14} />
              </ThemeIcon>
              <Text fw={600} size="sm" className="text-gray-700">
                To Buy
              </Text>
            </Group>
            <Stack gap="xs">
              {pending.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </Stack>
          </Card>
        )}

        {/* Purchased Items */}
        {purchased.length > 0 && (
          <Card
            shadow="xs"
            radius="md"
            className="border border-gray-200 bg-white/40! backdrop-blur-lg! mb-10!"
          >
            <Group mb="md">
              <ThemeIcon color="green" variant="light" size="sm">
                <IconCheck size={14} />
              </ThemeIcon>
              <Text fw={600} size="sm" className="text-gray-700">
                Purchased
              </Text>
            </Group>
            <Stack gap="xs">
              {purchased.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </Stack>
          </Card>
        )}

        {/* Empty State */}
        {items.length === 0 && (
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
              color="green"
              leftSection={<IconPlus size={14} />}
              onClick={open}
            >
              Add First Item
            </Button>
          </Card>
        )}
      </Container>
      {/* Add Item Modal */}
      <Modal
        opened={modalOpened}
        onClose={close}
        title={<Title order={4}>Add to Shopping List</Title>}
        centered
        size="sm"
      >
        <Stack gap="sm">
          <TextInput
            label="Item Name"
            placeholder="e.g. Olive Oil"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Group grow>
            <NumberInput
              label="Quantity"
              min={1}
              value={form.quantity}
              onChange={(val) =>
                setForm({ ...form, quantity: Number(val) || 1 })
              }
            />
            <TextInput
              label="Unit"
              placeholder="e.g. kg, cans"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </Group>
          <Select
            label="Category"
            data={CATEGORIES}
            value={form.category}
            onChange={(val) => setForm({ ...form, category: val || "Other" })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={16} />}
              onClick={handleAdd}
              disabled={!form.name.trim()}
            >
              Add to List
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Layout>
  );
}
