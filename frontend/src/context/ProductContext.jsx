import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/baseUrlApi";
import { toast } from "react-toastify";
// ======= CREATE PRODUCT CONTEXT ===========
const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [toUpdateProduct, setToUpdateProduct] = useState({})
    const [fetchProducts, setFetchedProducts] = useState(true)
    const [productDetails, setProductDetails] = useState()

    //============= FETCH PRODUCTS ========================== 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/products");
                const allProducts = data.data || data;
                setProducts(allProducts);
            } catch (error) {
                toast.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [fetchProducts]);
    return (
        <ProductContext.Provider value={{
            products,
            setToUpdateProduct,
            toUpdateProduct,
            fetchProducts,
            setFetchedProducts,
            productDetails,
            setProductDetails,
        }}>
            {children}
        </ProductContext.Provider>
    );
};
export const useProduct = () => useContext(ProductContext);