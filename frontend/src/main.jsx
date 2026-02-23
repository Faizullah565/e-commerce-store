import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_STRIPE_KEY
);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // </StrictMode>,
  <AuthProvider>
    <ProductProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
        <App />
        </Elements>
      </CartProvider>
    </ProductProvider>
  </AuthProvider>
)
