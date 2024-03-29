import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewPassword from "./components/Auth/NewPassword";
import Register from "./components/Auth/Register";
import ResetPassword from "./components/Auth/ResetPassword";
import SignIn from "./components/Auth/Signin";
import Header from "./components/Header/Header";
import HomeScreen from "./components/Home/HomeScreen";
import DetailScreen from "./components/Profile/DetailScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/detail" element={<DetailScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/requestReset" element={<ResetPassword />} />
        <Route path="/newPassword" element={<NewPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
