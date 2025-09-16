import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EventList from "./pages/Events/EventList";
import CreateEvent from "./pages/Events/CreateEvent";
import BulkUpload from "./pages/Events/BulkUpload";
import CorrelatePage from "./pages/Correlator/CorrelatePage";
import ClusterList from "./pages/Correlator/ClusterList";
import PrivateRoute from "./components/PrivateRoute";
export default function App(){
  return (<BrowserRouter><Header /><Routes>
    <Route path="/" element={<div style={{padding:12}}><h2>Welcome to NovaNet</h2></div>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/events" element={<PrivateRoute><EventList/></PrivateRoute>} />
    <Route path="/events/create" element={<PrivateRoute><CreateEvent/></PrivateRoute>} />
    <Route path="/events/upload" element={<PrivateRoute><BulkUpload/></PrivateRoute>} />
    <Route path="/correlate" element={<PrivateRoute><CorrelatePage/></PrivateRoute>} />
    <Route path="/clusters" element={<PrivateRoute><ClusterList/></PrivateRoute>} />
    <Route path="*" element={<div style={{padding:12}}>Page not found</div>} />
  </Routes></BrowserRouter>);
}
