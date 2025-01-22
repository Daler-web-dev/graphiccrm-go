import React, { useState } from "react";
import { DragAndDropView } from "../components/Drag&Drop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";

interface EditorProps { }

const Editor: React.FC<EditorProps> = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        width: 200,
        height: 250,
        arc: 0,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    return (
        <div className="w-full flex items-start justify-between gap-5 p-5">
            <Card className="w-[400px] h-[97vh]">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold bg-cGradientBg bg-clip-text text-transparent text-start">Редактор</CardTitle>
                    <RotateCcw className="cursor-pointer w-5 h-5 text-cDarkBlue"
                        onClick={() => {
                            setFormState({
                                width: 200,
                                height: 250,
                                arc: 0
                            })
                        }}
                    />
                </CardHeader>
                <CardContent className="h-[90vh] flex flex-col justify-between">
                    <div className="flex flex-col items-start gap-4">
                        <form className="flex flex-col w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <label
                                    htmlFor="width"
                                    className="flex flex-col items-start"
                                >
                                    <span>Width</span>
                                    <input
                                        type="number"
                                        id="width"
                                        value={formState.width}
                                        onChange={handleChange}
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
                                        value={formState.height}
                                        onChange={handleChange}
                                        className="border rounded-md p-1 w-full"
                                    />
                                </label>
                            </div>
                            <hr className="my-5" />
                            <label
                                htmlFor="arc"
                                className="flex flex-col items-start"
                            >
                                <span>Arc</span>
                                <input
                                    type="number"
                                    id="arc"
                                    value={formState.arc}
                                    onChange={handleChange}
                                    className="border rounded-md p-1 w-full"
                                />
                            </label>
                        </form>
                    </div>
                    <div className="flex justify-between items-center">
                        <Button className="px-5">
                            Сохранить
                        </Button>
                        <ConfirmModal title="Отменить редактирование?" setState={(state) => {
                            if (state) {
                                setFormState({
                                    width: 200,
                                    height: 250,
                                    arc: 0,
                                });
                                navigate(-1)
                            }
                        }}>
                            <Button className="px-5 bg-gradient-to-r from-red-400 to-red-700">
                                Отменить
                            </Button>
                        </ConfirmModal>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-[97vh]">
                <CardContent className="w-full h-full flex justify-center items-center">
                    <DragAndDropView width={formState.width} height={formState.height} rounded={formState.arc} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Editor;