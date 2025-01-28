import React, { createContext, useContext, useState } from 'react';
import { ICategory } from '@/models/categories';
import { IProduct } from '@/models/products';

interface FormState {
    width: number;
    height: number;
    arc: number;
}

interface StateManagerContextProps {
    tabs: ICategory[];
    setTabs: React.Dispatch<React.SetStateAction<ICategory[]>>;
    activeTabId: string;
    setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
    products: IProduct[];
    setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
    filteredProducts: IProduct[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    formData: FormState;
    setFormData: React.Dispatch<React.SetStateAction<FormState>>;
}

export const StateManagerContext = createContext<StateManagerContextProps>({} as StateManagerContextProps);

interface StateManagerProviderProps {
    children: React.ReactNode;
}

export const StateManagerProvider: React.FC<StateManagerProviderProps> = ({ children }) => {
    const [tabs, setTabs] = useState<ICategory[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>('');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormState>({ width: 250, height: 400, arc: 0 });

    return (
        <StateManagerContext.Provider
            value={{
                tabs,
                setTabs,
                activeTabId,
                setActiveTabId,
                products,
                setProducts,
                filteredProducts,
                setFilteredProducts,
                loading,
                setLoading,
                formData,
                setFormData
            }}
        >
            {children}
        </StateManagerContext.Provider>
    )
};

export const useStateManager = () => {
    const context = useContext(StateManagerContext);
    if (!context) {
        throw new Error('useStateManager must be used within a StateManagerProvider');
    }
    return context;
};
