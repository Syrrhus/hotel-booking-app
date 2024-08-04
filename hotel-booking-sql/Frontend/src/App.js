import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import Hotel from './pages/hotel/Hotel';
import List from './pages/list/List';
import HotelReservationFormWrapper from "./pages/hotelreservationform/HotelReservationForm";
import SuccessPage from './pages/succesPage/successPage';
import CancelPage from './pages/cancelPage/cancelPage';
import Payment from "./pages/payment/Payment";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/hotels/:id/book" element={<HotelReservationFormWrapper />} />
        <Route path="/hotels/:id/payment" element={<Payment />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
