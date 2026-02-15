import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
} from "@mantine/core";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  IconAlertCircle,
  IconChartBar,
  IconBell,
  IconCalendar,
  IconShoppingCart,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useAppSelector } from "../store/hooks";

function LandingPage() {
  const features = [
    {
      icon: <IconShoppingCart size={32} className="text-green-600" />,
      title: "Smart Inventory",
      description:
        "Keep track of all your pantry items in one organized place with easy add, edit, and delete functions.",
    },
    {
      icon: <IconCalendar size={32} className="text-blue-600" />,
      title: "Expiry Tracking",
      description:
        "Never waste food again. Get notifications before items expire so you can use them in time.",
    },
    {
      icon: <IconBell size={32} className="text-orange-600" />,
      title: "Low Stock Alerts",
      description:
        "Receive alerts when items are running low, helping you plan your grocery trips efficiently.",
    },
    {
      icon: <IconChartBar size={32} className="text-purple-600" />,
      title: "Usage Analytics",
      description:
        "Visualize your consumption patterns and make smarter purchasing decisions.",
    },
    {
      icon: <IconAlertCircle size={32} className="text-red-600" />,
      title: "Waste Prevention",
      description:
        "Reduce food waste by staying on top of expiration dates and quantities.",
    },
    {
      icon: <IconTrendingUp size={32} className="text-teal-600" />,
      title: "Grocery Planning",
      description:
        "Plan your shopping lists based on what's actually needed in your pantry.",
    },
  ];
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mx-20 mt-30">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6">
              <Title order={1} className="mb-6!">
                Manage Your Pantry, Reduce Waste
              </Title>
              <Text size="xl" className="mb-8!">
                Keep track of your inventory, monitor expiry dates, and stay on
                top of your shopping list all in one place. Stockly helps you
                stay organized and save money.
              </Text>
            </div>
            <Group justify="center" gap="md">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  color="black"
                  component={Link}
                  to="/signup"
                  className="px-8 hover:scale-105 transition-transform duration-700"
                >
                  Get Started
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                color="black"
                component={Link}
                to="/features"
                className="hover:"
              >
                Learn More
              </Button>
            </Group>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 mt-20">
        <Container size="lg">
          <div className="text-center mb-12">
            <Title order={2} className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </Title>
            <Text size="lg">
              Powerful features to help you manage your pantry efficiently and
              reduce food waste.
            </Text>
          </div>

          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="lg"
            className="mb-10!"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                className="bg-white/40! backdrop-blur-lg! hover:scale-105 transition-transform duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <Title
                  order={3}
                  className="text-xl font-semibold text-gray-900 mb-3"
                >
                  {feature.title}
                </Title>
                <Text size="sm" className="text-gray-600 leading-relaxed">
                  {feature.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>
    </Layout>
  );
}

export default LandingPage;
