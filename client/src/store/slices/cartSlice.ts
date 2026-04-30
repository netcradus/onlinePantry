import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    product: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
}

// Initial state from localStorage if available
const loadCartFromStorage = (): CartState => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return { items: [], totalQuantity: 0, totalAmount: 0 };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
};

const initialState: CartState = loadCartFromStorage();

const calculateTotals = (items: CartItem[]) => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.product === newItem.product);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.product !== productId);

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.product === productId);

            if (existingItem) {
                if (quantity > 0) {
                    existingItem.quantity = quantity;
                } else {
                    state.items = state.items.filter((item) => item.product !== productId);
                }
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem('cart');
        },
        setCart: (state, action: PayloadAction<{ items: any[] }>) => {
            // Used when syncing from server
            state.items = action.payload.items.map((item: any) => ({
                product: item.product._id,
                name: item.product.name,
                price: item.product.discountPrice || item.product.price,
                image: item.product.images[0],
                quantity: item.quantity
            }));
            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
            localStorage.setItem('cart', JSON.stringify(state));
        }
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
