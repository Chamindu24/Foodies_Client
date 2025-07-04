import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../services/foodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);
    const [quantity, setQuantity] = useState({});

    const increseQuantity = (id) => {
        setQuantity((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const decreseQuantity = (id) => {
        setQuantity((prev) => {
            const newQuantity = (prev[id] || 0) - 1;
            if (newQuantity <= 0) {
                const { [id]: _, ...rest } = prev; // Remove the item if quantity is 0
                return rest;
            }
            return {
                ...prev,
                [id]: newQuantity
            };
        });
    };
    const removeFromCart = (id) => {
        setQuantity((prev) => {
            const { [id]: _, ...rest } = prev; // Remove the item from cart
            return rest;
        });
    };  

    const contextValue = {
        foodList,
        increseQuantity,
        decreseQuantity,
        quantity,
        removeFromCart
    };

    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);
        }
        loadData();
    },[])

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}