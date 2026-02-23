import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './components/Home'
import { ToastContainer } from 'react-toastify'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AddProduct from './components/AddProduct'
import UserProfile from './pages/UserProfile'
import MyOrders from './components/MyOrders'
import Profile from './components/Profile'
import ProtectedRoutes from './utils/ProtectedRoutes'
import UserProducts from './components/UserProducts'
import Settings from './components/Settings'
import EditUserProduct from './components/EditUserProduct'
import ProductDetailPage from './pages/ProductDetailPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoutes />}>
              {/* USER PROFILE/ ACCOUNT ROUTES */}
            <Route path="/profile" element={<UserProfile />}>
              <Route index element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="fetch-my-products" element={<UserProducts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="edit-product" element={<EditUserProduct/>} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword/>} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  )
}

export default App
