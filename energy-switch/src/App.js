import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdPage from "./AdPage";
import FormPage from "./FormPage";
import SuccessPage from "./SuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;