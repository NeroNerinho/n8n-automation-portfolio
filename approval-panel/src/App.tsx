import { Route, Routes, Navigate } from "react-router-dom"
import AppShell from "@/layouts/AppShell"
import Dashboard from "@/pages/Dashboard"
import Approvals from "@/pages/Approvals"
import Settings from "@/pages/Settings"
import Reports from "@/pages/Reports"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import SystemStatus from "@/pages/SystemStatus"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<div className="p-4">Histórico em breve</div>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/status" element={<SystemStatus />} />
      </Route>
      {/* Catch-all route to redirect unknown paths to / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
