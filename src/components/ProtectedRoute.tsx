import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sandbox" />;
  }

  return <>{children}</>;
}
