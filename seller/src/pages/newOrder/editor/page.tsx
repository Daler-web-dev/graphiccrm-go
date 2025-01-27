import React, { useState } from "react";
import { DragAndDropView } from "../components/Drag&Drop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { EditorTabs } from "../components/Tabs";
import { useStateManager } from "@/contexts/useStateContext";

interface EditorProps { }

interface FormState {
    width: number;
    height: number;
    arc: number;
}

const Editor: React.FC<EditorProps> = () => {
    const navigate = useNavigate();
    const defaultValues = { width: 250, height: 400, arc: 0 };

    const { register, reset, handleSubmit } = useForm<FormState>({ defaultValues });

    const [formData, setFormData] = useState<FormState>(defaultValues);
    const { filteredProducts } = useStateManager();

    const onSubmit = (data: FormState) => {
        console.log(data);
    };

    return (
        <div className="w-full flex items-start justify-between gap-5 p-5">
            <Card className="w-[400px] h-[97vh]">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold bg-cGradientBg bg-clip-text text-transparent text-start">Редактор</CardTitle>
                    <RotateCcw
                        className="cursor-pointer w-5 h-5 text-cDarkBlue"
                        onClick={() => {
                            reset();
                            setFormData(defaultValues);
                        }}
                    />
                </CardHeader>
                <CardContent className="h-[90vh]">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="h-full flex flex-col justify-between"
                    >
                        {/* width - height - arc div */}
                        <div className="flex flex-col items-start gap-4">
                            <form className="flex flex-col w-full">
                                <h2 className='font-semibold text-base mb-2'>Размер</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <label
                                        htmlFor="width"
                                        className="flex flex-col items-start"
                                    >
                                        <span>Width</span>
                                        <input
                                            type="number"
                                            id="width"
                                            {...register("width")}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    width: Number(e.target.value),
                                                });
                                            }}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    </label>
                                    <label
                                        htmlFor="height"
                                        className="flex flex-col items-start"
                                    >
                                        <span>Height</span>
                                        <input
                                            type="number"
                                            id="height"
                                            {...register("height")}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    height: Number(e.target.value),
                                                });
                                            }}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    </label>
                                </div>
                                <label
                                    htmlFor="arc"
                                    className="flex flex-col items-start"
                                >
                                    <span>Arc</span>
                                    <input
                                        type="number"
                                        id="arc"
                                        {...register("arc")}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                arc: Number(e.target.value),
                                            });
                                        }}
                                        className="border rounded-md p-1 w-full"
                                    />
                                </label>
                                {/* Tabs component */}
                                <EditorTabs />
                                <div>
                                    <ul>
                                        {filteredProducts?.map((product) => (
                                            <li key={product.id}>{product.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </form>
                        </div>

                        {/* save or reset div */}
                        <div className="flex justify-start items-end gap-3">
                            <Button className="px-5">
                                Сохранить
                            </Button>
                            <ConfirmModal
                                title="Отменить редактирование?"
                                setState={(state) => {
                                    if (state) {
                                        reset();
                                        setFormData(defaultValues);
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
                <CardContent className="w-full h-full flex justify-center items-center">
                    <DragAndDropView
                        width={formData.width}
                        height={formData.height}
                        rounded={formData.arc}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Editor;
