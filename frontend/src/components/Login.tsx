import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Text,
  Title,
  Divider,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { loginThunk } from "../store/thunks/userThunk";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { clearError } from "../store/slice/userSlice";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const { isLoading, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk(formData)).unwrap();
      navigate("/inventory");
    } catch (error) {}
  };

  const handleChange = (
    field: keyof LoginFormData,
    value: string | boolean,
  ) => {
    if (error) dispatch(clearError());
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Layout>
      <div className="w-screen h-screen">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-5">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                className="tracking-[0.14em] text-gray-600 mb-2"
              >
                Welcome Back
              </Text>
              <Title order={2} className="text-gray-900 mb-2">
                Sign in to Stockly
              </Title>
              <Text size="sm" className="text-gray-600">
                Pick up where you left off and manage your pantry in seconds.
              </Text>
            </div>
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="filled"
                p="xs"
                className="mb-4"
              >
                {error}
              </Alert>
            )}
            <Paper
              shadow="lg"
              radius="xl"
              p="xl"
              withBorder
              className="bg-white/40! backdrop-blur-lg!"
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    size="md"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    styles={{
                      input: {
                        borderRadius: "0.5rem",
                        "&:focus": {
                          borderColor: "#1E1E1E",
                        },
                      },
                    }}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    size="md"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    styles={{
                      input: {
                        borderRadius: "0.5rem",
                        "&:focus": {
                          borderColor: "#1E1E1E",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    loading={isLoading}
                    fullWidth
                    size="md"
                    className="rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-5"
                    style={{
                      backgroundColor: "#1E1E1E",
                    }}
                    styles={{
                      root: {
                        "&:hover": {
                          backgroundColor: "#2E2E2E",
                        },
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </form>

              <Divider
                label="Or continue with"
                labelPosition="center"
                my="lg"
                className="text-black"
              />
              <Button
                variant="outline"
                fullWidth
                size="md"
                leftSection={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                }
                className="rounded-lg"
              >
                Google
              </Button>
            </Paper>
            <div className="mt-6 rounded-xl border border-white/70 bg-white/35 backdrop-blur-md px-4 py-3 text-center shadow-sm">
              <Text size="sm" className="text-gray-700">
                New to Stockly?
                <button
                  onClick={() => navigate("/signup")}
                  className="ml-2 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline hover:cursor-pointer"
                >
                  Create your account
                </button>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
