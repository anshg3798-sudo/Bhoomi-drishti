import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RegionProvider } from "./context/RegionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import RiskMap from "./pages/RiskMap";
import PriorityZones from "./pages/PriorityZones";
import Recommendations from "./pages/Recommendations";
import CitizenValidation from "./pages/CitizenValidation";
import About from "./pages/About";

function withProviders(children) {
  return (
    <RegionProvider>
      <ProtectedRoute><ErrorBoundary>{children}</ErrorBoundary></ProtectedRoute>
    </RegionProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={withProviders(<Dashboard />)} />
          <Route path="/analysis" element={withProviders(<Analysis />)} />
          <Route path="/risk-map" element={withProviders(<RiskMap />)} />
          <Route path="/priority-zones" element={withProviders(<PriorityZones />)} />
          <Route path="/recommendations" element={withProviders(<Recommendations />)} />
          <Route path="/validation" element={withProviders(<CitizenValidation />)} />
          <Route path="/about" element={withProviders(<About />)} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
