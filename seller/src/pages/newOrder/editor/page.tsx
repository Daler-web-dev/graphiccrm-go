import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { EditorTabs } from "../components/Tabs";
import { ViewZone } from "../components/ViewZone";
import { TabModels } from "../components/TabModels";
import { useStateManager } from "@/contexts/useStateContext";

interface EditorProps { }

const Editor: React.FC<EditorProps> = () => {
    const navigate = useNavigate();
    const { formMethods, onSubmit } = useStateManager();
    const { register, reset, handleSubmit, watch } = formMethods;
    const { width } = watch();

    return (
        <div className="w-full flex items-start justify-between gap-5 p-5">
            <Card className="h-[97vh]">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold bg-cGradientBg bg-clip-text text-transparent text-start">
                        Редактор
                    </CardTitle>
                    <RotateCcw
                        className="cursor-pointer w-5 h-5 text-cDarkBlue"
                        onClick={() => reset()}
                    />
                </CardHeader>
                <CardContent className="h-[90vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                        {/* width - height - arc div */}
                        <div className="flex flex-col items-start gap-4">
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
                                    max={width / 2}
                                    min={0}
                                    {...register("arc")}
                                    className="w-full border rounded-md p-1"
                                />
                            </label>
                            {/* Tabs component */}
                            <EditorTabs />
                            <TabModels />
                        </div>

                        {/* save or reset div */}
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
                <CardContent className="w-full h-full flex justify-center items-center">
                    <ViewZone />
                </CardContent>
            </Card>
        </div>
    );
};

export default Editor;
