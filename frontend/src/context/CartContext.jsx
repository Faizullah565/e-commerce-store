import { useEffect } from "react";
import { useRef } from "react";
import { createContext, useContext, useState } from "react";
import api from "../utils/baseUrlApi";
import { toast } from "react-toastify";

// ======== CREATE A CART CONTEXT ===========
const CartContext = createContext();
// ====== DEBOUNCING FOR DELAY API CALL ==============
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
// ============== CART PROVIDER =====================
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [fetchedCarts, setFetchedCarts] = useState('');
  const token = localStorage.getItem("auth-token")
  const isFirstLoad = useRef(true);
  const debouncedSyncRef = useRef(null);

  const syncCartToServer = async (cartItems) => {
    const simplifiedCart = cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price
    }));
    try {
      // ===== API CALL FOR ADD, UPDATE, AND DELETE ITEMS ==================== 
      const userCarts = await api.put("/cart/add-update-sync",
        { items: simplifiedCart },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token")
          }
        }
      );
    } catch (err) {
      toast.error("Cart sync failed", err);
    }
  };

  // =============== FETCH LOGIN USER CART ITEMS ============
  useEffect(() => {
    if (!token) return
    const fetchCart = async () => {
      const res = await api.get("/cart",
        {
          headers: {
            Authorization: token
          }
        }
      );
      setCart(res.data.items);
    };
    fetchCart();
  }, [token, fetchedCarts]);

  useEffect(() => {
    debouncedSyncRef.current = debounce(syncCartToServer, 800);
  }, []);
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    debouncedSyncRef.current(cart);
  }, [cart]);

  // ========== ITEM ADD-TO-CART FROM PRODUCTS PAGE =====================
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, }];
    });
  };

  // ========== ITEM ADD-TO-CART FROM DETAILS PAGE =====================
  const detailsToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + +product.quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity: +product.quantity, }];
    });
  };

  // ========= INCREASE CART QUANTITY ====================
  const increaseQuantity = (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  // ========= DECREASE CART QUANTITY ====================
  const decreaseQuantity = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0) // quantity greater than 1
    );
  };
  // ========= ITEM REMOVE FROM CART ====================
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  // ========= CLEAR CART ====================
  const clearCart = () => setCart([]);
  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        itemsPrice,
        detailsToCart,
        setFetchedCarts,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);