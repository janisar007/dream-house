import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/sign-in" element={<Signin />} />

          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/about" element={<About />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
//3:27:54
