import React, { createContext, useContext, useState } from 'react';
import { ICategory } from '@/models/categories';
import { IProduct } from '@/models/products';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

export interface FormState {
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
    selectedProducts: any[];
    setSelectedProducts: React.Dispatch<React.SetStateAction<any[]>>;
    selectedProduct: any;
    setSelectedProduct: React.Dispatch<React.SetStateAction<any>>;
    selectedProductPosition: any
    setSelectedProductPosition: any
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    formMethods: UseFormReturn<FormState>;
    onSubmit: (data: FormState) => void;
}

export const StateManagerContext = createContext<StateManagerContextProps | undefined>(undefined);

interface StateManagerProviderProps {
    children: React.ReactNode;
}

export const StateManagerProvider: React.FC<StateManagerProviderProps> = ({ children }) => {
    const [editorData, setEditorData] = useState<any>([]);
    const [tabs, setTabs] = useState<ICategory[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>("");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>();
    const [selectedProductPosition, setSelectedProductPosition] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    const formMethods = useForm<FormState>({
        defaultValues: { width: 250, height: 400, arc: 0 },
        mode: 'onChange'
    });

    const onSubmit = (data: FormState) => {
        if (selectedProducts.length === 0) return toast({ title: 'Ошибка', description: 'Выберите детали и отредактируйте их', variant: 'destructive', });
        const readyData = { ...data, selectedProducts };
        setEditorData([...editorData, readyData]);
        console.log("Submitted data:", readyData);
    };

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
                selectedProducts,
                setSelectedProducts,
                selectedProduct,
                setSelectedProduct,
                selectedProductPosition,
                setSelectedProductPosition,
                loading,
                setLoading,
                formMethods,
                onSubmit
            }}
        >
            {children}
        </StateManagerContext.Provider>
    );
};

export const useStateManager = () => {
    const context = useContext(StateManagerContext);
    if (!context) {
        throw new Error('useStateManager must be used within a StateManagerProvider');
    }
    return context;
};
