export const calculateCartTotals = (cardItems, quantity) => {
    const subtotal = cardItems.reduce((total, food) => total + (food.price * quantity[food.id]), 0);
    const shipping = subtotal > 0 ? 10 : 0; // Free shipping if cart is empty
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return {subtotal, shipping, tax, total};
};