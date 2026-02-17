import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Badge,
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
  IconLeaf,
  IconStar,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { useAppSelector } from "../store/hooks";

export default function LandingPage() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const features = [
    {
      icon: <IconShoppingCart size={22} />,
      color: "#16a34a",
      bg: "#dcfce7",
      title: "Smart Inventory",
      description:
        "Keep track of all your pantry items in one organized place with easy add, edit, and delete functions.",
    },
    {
      icon: <IconCalendar size={22} />,
      color: "#2563eb",
      bg: "#dbeafe",
      title: "Expiry Tracking",
      description:
        "Never waste food again. Get visual alerts before items expire so you can use them in time.",
    },
    {
      icon: <IconBell size={22} />,
      color: "#ea580c",
      bg: "#ffedd5",
      title: "Low Stock Alerts",
      description:
        "Automatic alerts when items are running low, helping you plan grocery trips efficiently.",
    },
    {
      icon: <IconChartBar size={22} />,
      color: "#7c3aed",
      bg: "#ede9fe",
      title: "Usage Analytics",
      description:
        "Visualize your consumption patterns and make smarter, data-driven purchasing decisions.",
    },
    {
      icon: <IconAlertCircle size={22} />,
      color: "#dc2626",
      bg: "#fee2e2",
      title: "Waste Prevention",
      description:
        "Reduce food waste by staying on top of expiration dates and quantities at all times.",
    },
    {
      icon: <IconTrendingUp size={22} />,
      color: "#0d9488",
      bg: "#ccfbf1",
      title: "Grocery Planning",
      description:
        "Auto-generate shopping lists based on what's actually running low in your pantry.",
    },
  ];

  return (
    <Layout>
      <div className="landing-hero overflow-hidden">
        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="dot-grid absolute inset-0 opacity-40" />

          <Container size="lg" className="relative z-10 pt-24">
            <div className="grid lg:grid-cols-[auto_auto] gap-4 items-center">
              {/* ───── LEFT COLUMN ───── */}
              <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                {/* Badge */}
                <div className="hero-badge mb-6">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    <IconLeaf size={14} />
                    Smart Pantry Management
                    <IconStar size={12} fill="#16a34a" />
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="hero-title text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  Your pantry, <span className="shimmer-text">perfectly</span>
                  <br />
                  organized.
                </h1>

                <p className="hero-sub text-xl text-green-950 mb-10 leading-relaxed font-normal">
                  Track ingredients, catch expiry dates early, and never run out
                  of what matters. Stockly keeps your kitchen running smoothly.
                </p>

                <div className="hero-cta flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                  {!isAuthenticated && (
                    <Button
                      size="lg"
                      component={Link}
                      to="/signup"
                      className="cta-btn"
                      rightSection={<IconArrowRight size={16} />}
                      style={{
                        background: "#111",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: 600,
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                      }}
                    >
                      Get Started Free
                    </Button>
                  )}
                </div>

                {/* Social proof */}
                <div className="hero-cta mt-10 flex items-center gap-3 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {["#16a34a", "#2563eb", "#7c3aed", "#ea580c"].map(
                      (c, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                          style={{ background: c }}
                        >
                          {["A", "B", "C", "D"][i]}
                        </div>
                      ),
                    )}
                  </div>
                  <Text size="sm" className="text-gray-500">
                    <strong className="text-gray-800">2,400+</strong> households
                    already saving food
                  </Text>
                </div>
              </div>

              {/* ───── RIGHT COLUMN ───── */}
              <div className="hidden lg:flex flex-col gap-6 items-center">
                {[
                  {
                    name: "Basmati Rice",
                    qty: "2 kg",
                    status: "In stock",
                    color: "#16a34a",
                    bg: "#f0fdf4",
                    pct: 75,
                  },
                  {
                    name: "Olive Oil",
                    qty: "500 ml",
                    status: "Low stock",
                    color: "#ea580c",
                    bg: "#fff7ed",
                    pct: 25,
                  },
                  {
                    name: "Greek Yogurt",
                    qty: "1 tub",
                    status: "Expires soon",
                    color: "#dc2626",
                    bg: "#fef2f2",
                    pct: 10,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="float-card bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-100 w-64"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Text fw={600} size="sm" className="text-gray-800">
                        {item.name}
                      </Text>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: item.bg, color: item.color }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <Text size="xs" className="text-gray-400 mb-2">
                      {item.qty}
                    </Text>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.pct}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FEATURES */}
        <section id="features" className="mb-10">
          <Container size="lg">
            <div className="text-center my-12">
              <Badge color="black" variant="light" size="lg" className="mb-4">
                Features
              </Badge>
              <h2
                className="text-5xl font-bold text-gray-900 mb-4"
                style={{ letterSpacing: "-0.03em" }}
              >
                Features That Make Life Easier
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="feature-card border border-gray-100 bg-white/70! backdrop-blur-md! rounded-2xl!"
                  shadow="xs"
                  padding="xl"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: feature.bg, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <Title
                    order={3}
                    className="text-lg font-semibold text-gray-900 mb-2"
                  >
                    {feature.title}
                  </Title>
                  <Text
                    size="sm"
                    className="text-gray-500 leading-relaxed font-light"
                  >
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/*  ABOUT */}
        <section id="about" className="py-8 bg-white/50! backdrop-blur-sm!">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <Badge color="teal" variant="light" size="lg" className="mb-6">
                  About Stockly
                </Badge>
                <h2
                  className="text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Built by people who hate wasting food.
                </h2>
                <Text
                  size="lg"
                  className="text-gray-500 mb-6 font-light leading-relaxed"
                >
                  Stockly was born from a simple frustration — throwing away
                  expired food we forgot we had. We built the tool we wished
                  existed: simple, smart, and actually useful for real
                  households.
                </Text>
                <Text
                  size="md"
                  className="text-gray-500 mb-8 font-light leading-relaxed"
                >
                  Our mission is to help every household reduce food waste, save
                  money, and spend less time worrying about what's in the
                  fridge. Technology should make everyday life simpler, not more
                  complicated.
                </Text>
                <div className="space-y-3">
                  {[
                    "No subscriptions, no hidden fees",
                    "Privacy-first — your data stays yours",
                    "Built for real families, not spreadsheet enthusiasts",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "#f0fdf4" }}
                      >
                        <IconCheck size={12} color="#16a34a" />
                      </div>
                      <Text size="sm" className="text-gray-600">
                        {item}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div
                  className="rounded-3xl p-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #111 0%, #1f2937 100%)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-2xl"
                    style={{ background: "#16a34a" }}
                  />
                  <Text
                    className="text-sm font-semibold mb-6 uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Our Impact
                  </Text>
                  {[
                    {
                      label: "Food saved from waste",
                      value: "12,400 kg",
                      color: "#4ade80",
                    },
                    {
                      label: "Households served",
                      value: "2,400+",
                      color: "#60a5fa",
                    },
                    {
                      label: "Avg. savings per month",
                      value: "$47",
                      color: "#c084fc",
                    },
                    {
                      label: "Items tracked daily",
                      value: "180,000+",
                      color: "#fb923c",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-white/10 last:border-0"
                    >
                      <Text
                        size="sm"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {item.label}
                      </Text>
                      <Text fw={700} size="lg" style={{ color: item.color }}>
                        {item.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/*  CTA BANNER */}
        {!isAuthenticated && (
          <section className="py-12 mb-12" style={{ background: "#111" }}>
            <Container size="md">
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div
                    className="w-96 h-96 rounded-full"
                    style={{ background: "#16a34a", filter: "blur(80px)" }}
                  />
                </div>
                <div className="relative z-10">
                  <h2
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    Ready to take control
                    <br />
                    <span style={{ color: "#4ade80" }}>of your pantry?</span>
                  </h2>
                  <Text
                    size="lg"
                    className="font-light"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Join thousands of households saving food and money with
                    Stockly.
                  </Text>
                  <Group justify="center" gap="md" className="mt-6">
                    <Button
                      size="lg"
                      component={Link}
                      to="/signup"
                      className="cta-btn"
                      rightSection={<IconArrowRight size={16} />}
                      style={{
                        background: "#16a34a",
                        border: "none",
                        borderRadius: "12px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                      }}
                    >
                      Start for free
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      component={Link}
                      to="/login"
                      className="cta-btn"
                      style={{
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "rgba(255,255,255,0.7)",
                        borderRadius: "12px",
                        fontFamily: "Inter, sans-serif",
                        background: "transparent",
                      }}
                    >
                      Sign in
                    </Button>
                  </Group>
                </div>
              </div>
            </Container>
          </section>
        )}
      </div>
    </Layout>
  );
}
