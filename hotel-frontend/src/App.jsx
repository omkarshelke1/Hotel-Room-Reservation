import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import AdminDashboard from './pages/AdminDashboard';
import AddHotel from './pages/AddHotel'; // Need to create this
import AdminRoute from './components/AdminRoute';
import HotelDashboard from './pages/HotelDashboard';
import CustomerView from './pages/CustomerView';
import Login from './pages/Login';       // <--- Import
import Register from './pages/Register'; // <--- Import
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />

            {/* Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/hotel-manage/:id" element={<HotelDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/add-hotel" element={<AddHotel />} />
            </Route>

            <Route path="/customer" element={<CustomerView />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* Payment Routes */}
            <Route path="/payment-checkout" element={<PaymentCheckout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;