import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../services/foodService";
import { addToCart, getcartData, removeQtyFromCart } from "../services/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [token, setToken] = useState("");

    const increseQuantity = async (foodId) => {
        setQuantity((prev) => ({
            ...prev,
            [foodId]: (prev[foodId] || 0) + 1
        }));
        await addToCart(foodId, token);
    };

    const decreseQuantity = async (foodId) => {
        setQuantity((prev) => {
            const newQuantity = (prev[foodId] || 0) - 1;
            if (newQuantity <= 0) {
                const { [foodId]: _, ...rest } = prev; // Remove the item if quantity is 0
                return rest;
            }
            return {
                ...prev,
                [foodId]: newQuantity
            };
        });
        await removeQtyFromCart(foodId, token);
    };
    const removeFromCart = (foodId) => {
        setQuantity((prev) => {
            const { [foodId]: _, ...rest } = prev; // Remove the item from cart
            return rest;
        });
    };
    
    const loadCartData = async (token) => {
        const items = await getcartData(token);
        setQuantity(items);
        
    };

    const contextValue = {
        foodList,
        increseQuantity,
        decreseQuantity,
        quantity,
        removeFromCart,
        token,
        setToken,
        setQuantity,
        loadCartData
    };

    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
                await loadCartData(localStorage.getItem('token'));
            }
        }
        loadData();
    },[])

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}