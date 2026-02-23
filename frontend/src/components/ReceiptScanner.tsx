import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
  IconPhotoScan,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

export interface ScannedItem {
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  expiryDate: string;
}

const DEFAULT_ITEM: ScannedItem = {
  name: "",
  quantity: 1,
  unit: "pcs",
  minQuantity: 1,
  expiryDate: "",
};

interface ReceiptScannerProps {
  onItemsConfirmed: (items: ScannedItem[]) => void;
  onResultsStateChange?: (hasResults: boolean) => void;
}

const ReceiptScanner = ({
  onItemsConfirmed,
  onResultsStateChange,
}: ReceiptScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);

    setScanning(true);
    setError(null);
    setItems([]);
    setReceiptUrl(null);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/receipt/scan`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const prefilled: ScannedItem[] = response.data.items.map(
        (item: Partial<ScannedItem>) => ({
          name: item.name ?? "",
          quantity: item.quantity ?? 1,
          unit: item.unit ?? "pcs",
          minQuantity: item.minQuantity ?? 1,
          expiryDate: item.expiryDate ?? "",
        }),
      );

      setItems(prefilled);
      setReceiptUrl(response.data.receiptUrl ?? null);
    } catch (err) {
      const apiError = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.response?.data?.message)
        : null;
      setError(apiError || "Failed to scan receipt. Please try again.");
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof ScannedItem,
    value: string | number | Date | null,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    setItems((prev) => [...prev, { ...DEFAULT_ITEM }]);
  };

  const handleConfirm = () => {
    const validItems = items.filter((item) => item.name.trim() !== "");
    onItemsConfirmed(validItems);
    setItems([]);
    setReceiptUrl(null);
    setError(null);
  };

  // Keep local preview as primary so image does not disappear if remote URL is slow/private.
  const previewSrc = useMemo(
    () => localPreviewUrl || receiptUrl || undefined,
    [localPreviewUrl, receiptUrl],
  );
  const hasResults = Boolean(previewSrc) || items.length > 0;

  useEffect(() => {
    onResultsStateChange?.(hasResults);
  }, [hasResults, onResultsStateChange]);

  return (
    <Stack gap="md">
      {!hasResults && (
        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Button
              component="label"
              variant="filled"
              color="blue"
              radius="xl"
              className="receipt-upload-button"
              leftSection={
                scanning ? (
                  <Loader size="xs" color="white" />
                ) : (
                  <IconPhotoScan size={16} />
                )
              }
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Upload Receipt"}
              <input type="file" accept="image/*" hidden onChange={handleUpload} />
            </Button>
          </Group>

          <Paper withBorder radius="md" p="xs" className="receipt-upload-meta">
            <Group gap={6} mb={6} wrap="wrap">
              <IconInfoCircle size={15} color="#0369a1" />
              <Text size="xs" fw={600} c="#0f172a">
                Supported formats
              </Text>
              {["JPG", "JPEG", "PNG", "GIF", "WEBP"].map((format) => (
                <Badge key={format} size="xs" variant="light" color="blue">
                  {format}
                </Badge>
              ))}
            </Group>
            <Text size="xs" c="dimmed">
              Max file size: 5MB. For best accuracy, upload a clear and well-lit receipt image.
            </Text>
          </Paper>
        </Stack>
      )}

      {hasResults && items.length > 0 && (
        <Badge color="green" variant="light" size="lg" w="fit-content">
          {items.length} item{items.length === 1 ? "" : "s"} detected
        </Badge>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Scan failed">
          {error}
        </Alert>
      )}

      {hasResults && (
        <Grid gutter="md" align="stretch">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder radius="md" p="md" h="100%" className="receipt-preview-panel">
              <Stack gap="sm">
                <Text fw={700}>Receipt Preview</Text>
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt="Scanned receipt"
                    radius="md"
                    className="receipt-preview-image"
                    fallbackSrc="https://placehold.co/600x900?text=Receipt+Preview"
                  />
                ) : (
                  <Box className="receipt-preview-empty">
                    <Text size="sm" c="dimmed" ta="center">
                      Upload a receipt to preview it here
                    </Text>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder radius="md" p="md" className="receipt-items-panel">
              <Group justify="space-between" align="center">
                <Text fw={700}>Review and Edit Items</Text>
                <Button
                  variant="subtle"
                  leftSection={<IconPlus size={16} />}
                  onClick={handleAddRow}
                >
                  Add Item
                </Button>
              </Group>

              <Divider my="sm" />

              {scanning && items.length === 0 ? (
                <Stack align="center" justify="center" h={220} gap="xs">
                  <Loader color="teal" />
                  <Text size="sm" c="dimmed">
                    Extracting items from receipt...
                  </Text>
                </Stack>
              ) : items.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No items yet. Upload a receipt to populate this list.
                </Text>
              ) : (
                <ScrollArea h={420} type="hover" offsetScrollbars>
                  <Table
                    withTableBorder
                    withColumnBorders
                    striped
                    highlightOnHover
                    className="receipt-items-table"
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th miw={220}>Name</Table.Th>
                        <Table.Th miw={120}>Qty</Table.Th>
                        <Table.Th miw={120}>Unit</Table.Th>
                        <Table.Th miw={150}>Min Qty</Table.Th>
                        <Table.Th miw={210}>Expiry Date</Table.Th>
                        <Table.Th miw={70}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {items.map((item, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <TextInput
                              value={item.name}
                              placeholder="Milk"
                              onChange={(e) =>
                                handleItemChange(index, "name", e.target.value)
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.quantity}
                              min={1}
                              onChange={(val) =>
                                handleItemChange(index, "quantity", Number(val) || 1)
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <TextInput
                              value={item.unit}
                              placeholder="pcs"
                              onChange={(e) =>
                                handleItemChange(index, "unit", e.target.value)
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.minQuantity}
                              min={1}
                              onChange={(val) =>
                                handleItemChange(
                                  index,
                                  "minQuantity",
                                  Number(val) || 1,
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              value={item.expiryDate ? new Date(item.expiryDate) : null}
                              placeholder="Pick date"
                              clearable
                              onChange={(val) =>
                                handleItemChange(
                                  index,
                                  "expiryDate",
                                  val ? new Date(val).toISOString().split("T")[0] : "",
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => handleDeleteRow(index)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              )}

              <Group justify="flex-end" mt="md">
                <Button
                  color="green"
                  leftSection={<IconCheck size={16} />}
                  onClick={handleConfirm}
                  disabled={items.filter((i) => i.name.trim() !== "").length === 0}
                >
                  Add all to Inventory
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
};

export default ReceiptScanner;
