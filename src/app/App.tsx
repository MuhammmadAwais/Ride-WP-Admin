/**
 * @fileoverview Root App component.
 * Composes the Redux Provider, PersistGate, RouterProvider, Sonner Toaster,
 * and applies the active theme to <html> on mount.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { store, persistor } from './store';
import { router } from './router';
import { ThemeProvider, useTheme } from '@/Components/providers/ThemeProvider';
import { useSecureSession } from '@/hooks/useSecureSession';

/**
 * Inner component — must be inside Provider to access hooks that read Redux.
 * Applies theme class and security listeners.
 */
const AppInner: React.FC = () => {
  const { isDark } = useTheme();
  useSecureSession();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          style: { fontFamily: 'Roboto, sans-serif' },
        }}
      />
    </>
  );
};

/**
 * Top-level App component — sets up all global providers.
 */
function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
