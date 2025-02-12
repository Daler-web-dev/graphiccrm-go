import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw, X } from "lucide-react";
import { EditorTabs } from "../components/Tabs";
import { ViewZone } from "../components/ViewZone";
import { useStateManager } from "@/contexts/useStateContext";
import { cn } from "@/lib/utils";


const Editor = () => {
    const navigate = useNavigate();
    const [windows, setWindows] = useState<{ id: number; name: string }[]>([{ id: 1, name: "Окно 1" }]);
    const {
        formMethods,
        selectedProducts,
        setSelectedProduct,
        setSelectedProducts,
        selectedWindow,
        setSelectedWindow,
        onSubmit,
        windowsData,
        setWindowsData,
    } = useStateManager();
    const { register, reset, handleSubmit } = formMethods;

    const handleWindowSwitch = (window: { id: number; name: string }) => {
        setWindowsData((prev) => ({
            ...prev,
            [selectedWindow.id]: {
                formData: formMethods.getValues(),
                selectedProducts: selectedProducts,
            },
        }));
        console.log(selectedWindow, windowsData);

        const windowData = windowsData[window.id];
        if (windowData) {
            console.log(windowData);

            formMethods.reset(windowData.formData);
            setSelectedProducts(windowData.selectedProducts);
        } else {
            formMethods.reset({ width: 250, height: 400, arc: 0 });
            setSelectedProducts([]);
        }

        setSelectedWindow(window);
    };

    const addWindow = () => {
        const newWindow = { id: windows.length + 1, name: `Окно ${windows.length + 1}` };
        setWindows((prev) => [...prev, newWindow]);
        setWindowsData((prev) => ({
            ...prev,
            [newWindow.id]: {
                formData: { width: 250, height: 400, arc: 0, window: newWindow },
                selectedProducts: [],
            },
        }))
    };

    const removeWindow = (id: number) => {
        const updatedWindows = windows.filter((window) => window.id !== id);
        setWindows(updatedWindows);
        setSelectedWindow(updatedWindows[0]);

        setWindowsData((prev) => {
            const newData = { ...prev };
            delete newData[id];
            return newData;
        });
    };

    return (
        <div className="w-full flex items-start justify-between gap-5 p-5">
            <Card className="h-[97vh]">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold bg-cGradientBg bg-clip-text text-transparent text-start">
                        Редактор
                    </CardTitle>
                    <RotateCcw
                        className="cursor-pointer w-5 h-5 text-cDarkBlue"
                        onClick={() => {
                            reset();
                            setSelectedProducts([]);
                            setSelectedProduct(null);
                            setSelectedWindow({ id: 1, name: "Окно 1" });
                            setWindows([{ id: 1, name: "Окно 1" }]);
                            setWindowsData({});
                        }}
                    />
                </CardHeader>
                <CardContent className="h-[90vh]">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="h-full flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="font-semibold text-base mb-2">Окна</h2>
                            <ul className="w-[350px] flex gap-2 items-center overflow-x-scroll">
                                {windows.map((window, idx) => (
                                    <li
                                        key={idx}
                                        className={cn(
                                            "flex justify-between items-center gap-5 px-2 py-1 rounded-xl cursor-pointer text-sm font-medium",
                                            window.id === selectedWindow.id
                                                ? "bg-cLightBlue text-white"
                                                : "bg-gray-100"
                                        )}
                                        onClick={() => {
                                            if (window.id === selectedWindow.id) return;
                                            handleWindowSwitch(window);
                                        }}
                                    >
                                        {window.name}
                                        {window.id !== 1 && (
                                            <div
                                                className="rounded-full bg-red-500 p-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeWindow(window.id);
                                                }}
                                            >
                                                <X className="w-4 h-4 cursor-pointer text-white font-bold" />
                                            </div>
                                        )}
                                    </li>
                                ))}
                                <li onClick={addWindow}>
                                    <div className="rounded-full bg-gray-200 p-1">
                                        <Plus className="w-4 h-4 cursor-pointer text-cDarkBlue font-bold" />
                                    </div>
                                </li>
                            </ul>
                            <div className="flex flex-col items-start gap-4 mt-4">
                                <h2 className="font-semibold text-base mb-2">Размер</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <label htmlFor="width" className="flex flex-col items-start">
                                        <span>Width</span>
                                        <input
                                            type="number"
                                            id="width"
                                            {...register("width")}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    </label>
                                    <label htmlFor="height" className="flex flex-col items-start">
                                        <span>Height</span>
                                        <input
                                            type="number"
                                            id="height"
                                            {...register("height")}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    </label>
                                </div>
                                <label htmlFor="arc" className="w-full flex flex-col items-start">
                                    <span>Arc</span>
                                    <input
                                        type="number"
                                        id="arc"
                                        min={0}
                                        {...register("arc")}
                                        className="w-full border rounded-md p-1"
                                    />
                                </label>
                                <EditorTabs />
                            </div>
                        </div>
                        <div className="flex justify-start items-end gap-3">
                            <Button type="submit" className="px-5">
                                Сохранить
                            </Button>
                            <ConfirmModal
                                title="Отменить редактирование?"
                                setState={(state) => {
                                    if (state) {
                                        reset();
                                        navigate(-1);
                                    }
                                }}
                            >
                                <Button className="px-5 bg-gradient-to-r from-red-400 to-red-700">
                                    Отменить
                                </Button>
                            </ConfirmModal>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Card className="w-full h-[97vh]">
                <CardContent className="w-full h-full flex justify-center items-center relative">
                    <ViewZone />
                </CardContent>
            </Card>
        </div>
    );
};

export default Editor;