import { AppShell } from "@mantine/core";
import Header from "./Header";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header className="mx-20 rounded-2xl mt-3">
        <Header />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer className="bg-black!">
        <h1 className="text-center py-4 text-gray-400 ">
          © 2025 Stockly. All rights reserved.
        </h1>
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;
