import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from "./api/Login";
import Register from "./api/Register";
import Dashboard from "./api/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/api/login" element={<Login />}></Route>
          <Route path="/api/register" element={<Register />}></Route>
          <Route path="/api/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
