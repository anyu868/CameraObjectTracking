import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalErrorHandler } from "@/components/ErrorBoundary/GlobalErrorHandler";

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorHandler>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          </Routes>
        </Router>
      </GlobalErrorHandler>
    </ErrorBoundary>
  );
}
