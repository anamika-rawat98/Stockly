import {
  Group,
  Button,
  Text,
  Burger,
  Drawer,
  Avatar,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutThunk } from "../store/thunks/userThunk";
import {
  IconLogout,
  IconPackage,
  IconShoppingCart,
  IconChevronDown,
} from "@tabler/icons-react";

function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/");
    close();
  };

  return (
    <>
      <div className="flex items-center justify-between w-full h-15 bg-[#1E1E1E] rounded-2xl px-5">
        {/* Logo */}
        <Link to="/" className="no-underline">
          <Group gap="xs">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <img
                src="/images/icon.svg"
                alt="Stockly Icon"
                className="w-9 h-9"
              />
            </div>
            <Text size="xl" fw={700} c="white">
              Stockly
            </Text>
          </Group>
        </Link>

        {/* Desktop Nav */}
        <Group gap="xl" visibleFrom="md">
          {!isAuthenticated ? (
            // Public links
            <>
              <Link
                to="/"
                className="no-underline text-white hover:text-green-600 font-medium transition-colors"
              >
                Home
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-white hover:text-green-600 font-medium transition-colors hover:cursor-pointer bg-transparent border-none"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-white hover:text-green-600 font-medium transition-colors hover:cursor-pointer bg-transparent border-none"
              >
                About
              </button>
            </>
          ) : (
            // Protected links
            <>
              <Link
                to="/"
                onClick={close}
                className="no-underline text-white hover:text-green-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/inventory"
                className="no-underline text-white hover:text-green-600 font-medium transition-colors"
              >
                Inventory
              </Link>
              <Link
                to="/shopping-list"
                className="no-underline text-white hover:text-green-600 font-medium transition-colors"
              >
                Shopping List
              </Link>
            </>
          )}
        </Group>

        {/* Desktop Auth Buttons */}
        <Group gap="sm" visibleFrom="md">
          {!isAuthenticated ? (
            <>
              <Button
                variant="subtle"
                color="gray"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="filled"
                color="green"
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          ) : (
            // User menu dropdown
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="subtle"
                  color="gray"
                  rightSection={<IconChevronDown size={14} />}
                  leftSection={
                    <Avatar color="green" radius="xl" size="sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                >
                  <Text c="white" size="sm">
                    {user?.name}
                  </Text>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>My Account</Menu.Label>
                <Menu.Item
                  leftSection={<IconPackage size={14} />}
                  component={Link}
                  to="/inventory"
                >
                  Inventory
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconShoppingCart size={14} />}
                  component={Link}
                  to="/shopping-list"
                >
                  Shopping List
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        {/* Mobile Burger */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="md"
          size="md"
          color="white"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <img
                src="/images/icon.svg"
                alt="Stockly Icon"
                className="w-9 h-9"
              />
            </div>
            <Text fw={700}>Stockly</Text>
          </Group>
        }
        position="right"
        size="sm"
      >
        <div className="flex flex-col gap-4 pt-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className="text-left text-gray-700 hover:text-green-600 font-medium text-lg transition-colors bg-transparent border-none hover:cursor-pointer"
              >
                Home
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  close();
                }}
                className="text-left text-gray-700 hover:text-green-600 font-medium text-lg transition-colors bg-transparent border-none hover:cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left text-gray-700 hover:text-green-600 font-medium text-lg transition-colors bg-transparent border-none hover:cursor-pointer"
              >
                About
              </button>
              <div className="border-t pt-4 flex flex-col gap-3 mt-2">
                <Button
                  variant="outline"
                  color="gray"
                  component={Link}
                  to="/login"
                  onClick={close}
                  fullWidth
                >
                  Login
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  component={Link}
                  to="/signup"
                  onClick={close}
                  fullWidth
                >
                  Sign Up
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar color="green" radius="xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Text fw={600}>{user?.name}</Text>
                  <Text size="xs" c="dimmed">
                    {user?.email}
                  </Text>
                </div>
              </div>
              <Link
                to="/"
                className="no-underline text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/inventory"
                onClick={close}
                className="no-underline text-gray-700 hover:text-green-600 font-medium text-lg transition-colors"
              >
                Inventory
              </Link>
              <Link
                to="/shopping-list"
                onClick={close}
                className="no-underline text-gray-700 hover:text-green-600 font-medium text-lg transition-colors"
              >
                Shopping List
              </Link>
              <div className="border-t pt-4 mt-2">
                <Button
                  variant="light"
                  color="red"
                  fullWidth
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Header;
