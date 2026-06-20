import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { Spinner } from "./components/ui.jsx";
import Layout from "./components/Layout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Progress from "./pages/Progress.jsx";
import Reserves from "./pages/Reserves.jsx";
import Photos from "./pages/Photos.jsx";
import Documents from "./pages/Documents.jsx";
import Meetings from "./pages/Meetings.jsx";
import Planning from "./pages/Planning.jsx";
import Materials from "./pages/Materials.jsx";
import Stock from "./pages/Stock.jsx";
import Supply from "./pages/Supply.jsx";
import Orders from "./pages/Orders.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Finance from "./pages/Finance.jsx";
import UsersPage from "./pages/Users.jsx";
import Activity from "./pages/Activity.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/reserves" element={<Reserves />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/supply" element={<Supply />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/activity" element={<Activity />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
