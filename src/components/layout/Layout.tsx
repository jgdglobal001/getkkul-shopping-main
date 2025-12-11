"use client";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainLoader from "../MainLoader";
import { UserSyncProvider } from "../UserSyncProvider";

// Note: SessionProvider is already provided by AuthProvider in src/app/layout.tsx
// UserSyncProvider must be inside Redux Provider to access store

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        <UserSyncProvider>{children}</UserSyncProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
