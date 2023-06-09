import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ManageBook from "./components/ManageBook";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-book/:bookid?" element={<ManageBook />} />
      </Routes>
    </Router>
  );
};

export default App;
