import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const Cart = createContext();

const initialState = (() => {
  try {
    const saved = localStorage.getItem("cart:v1");
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
})();

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const exists = state.items.find(i => i.slug === action.item.slug);
      const items = exists
        ? state.items.map(i => i.slug === action.item.slug ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.item, qty: 1 }];
      return { ...state, items };
    }
    case "inc": {
      const items = state.items.map(i => i.slug === action.slug ? { ...i, qty: i.qty + 1 } : i);
      return { ...state, items };
    }
    case "dec": {
      const items = state.items
        .map(i => i.slug === action.slug ? { ...i, qty: Math.max(1, i.qty - 1) } : i)
        .filter(i => i.qty > 0);
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter(i => i.slug !== action.slug) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(state));
  }, [state]);

  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + i.price * i.qty, 0),
    [state.items]
  );

  const value = useMemo(() => ({ state, dispatch, subtotal }), [state, subtotal]);
  return <Cart.Provider value={value}>{children}</Cart.Provider>;
}

export const useCart = () => useContext(Cart);
