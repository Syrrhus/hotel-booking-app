import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import Hotel from './pages/hotel/Hotel';
import List from './pages/list/List';
import HotelReservationForm from "./pages/hotelreservationform/HotelReservationForm";
import { Payment } from '@mui/icons-material';
import CombinedForm from './pages/CombinedForm/CombinedForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/hotels/:id/book" element={<CombinedForm/>}/>
        <Route path="/hotels/:id/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
