import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Users/Register";
import Login from "./components/Users/Login";
import Dashboard from "./components/Users/Dashboard";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import Home from "./components/Home/Home";
import { useAuth } from "./AuthContext/AuthContext";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import BlogPostAIAssistant from "./components/ContentGeneration/ContentGeneration";
import Plans from "./components/Plans/Plan";
import ContentGenerationHistory from "./components/ContentGeneration/ContentHistory";
import AppFeatures from "./components/Features/Features";
import AboutUs from "./components/About/About";
import FreePlanSignup from "./components/RazorpayPayment/FreePlanSignup";
import CheckoutForm from "./components/RazorpayPayment/CheckoutForm";
import PaymentSuccess from "./components/RazorpayPayment/PaymentSuccess";

export default function App() {
  const { isAuthenticated } = useAuth();

  // ✅ Move logging inside component
  console.log("✅ CRA Env:", process.env);
  console.log("✅ Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);


  return (
    <BrowserRouter>
      {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/generate-content"
          element={
            <AuthRoute>
              <BlogPostAIAssistant />
            </AuthRoute>
          }
        />
        <Route
          path="/history"
          element={
            <AuthRoute>
              <ContentGenerationHistory />
            </AuthRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route
          path="/free-plan"
          element={
            <AuthRoute>
              <FreePlanSignup />
            </AuthRoute>
          }
        />
        <Route
          path="/checkout/:plan"
          element={
            <AuthRoute>
              <CheckoutForm />
            </AuthRoute>
          }
        />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/features" element={<AppFeatures />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}