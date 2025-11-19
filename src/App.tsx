import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { Spinner } from "./components/ui/spinner";
import { Button } from "./components/ui/button";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./context/TaskContext";

const Auth = lazy(() => import("./pages/Auth"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function App() {
  const navigate = useNavigate();
  return (
    <TaskProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        }
      >
        <div className="">
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles="lata@gmail.com">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect Routes */}
            <Route
              path="*"
              element={
                <div className="flex flex-col gap-3 items-center justify-center h-screen">
                  <h1 className="text-2xl font-semibold ">404 Page Not Found</h1>
                  <Button onClick={() => navigate("/")}>Let's Go Home</Button>
                </div>
              }
            />
          </Routes>
        </div>
      </Suspense>
    </TaskProvider>
  );
}

export default App;
