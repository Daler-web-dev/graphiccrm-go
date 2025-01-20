import React, { useEffect, useRef, useState } from "react";

interface EditorProps { }

const Editor: React.FC<EditorProps> = () => {
    const [formState, setFormState] = useState({
        width: 2,
        height: 2,
        leftTR: 0.2,
        leftBR: 0.2,
        rightTR: 0.2,
        rightBR: 0.2,
        arc: 0,
        arcSelect: "top",
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
        <div className="flex items-start justify-between w-full h-[90%] gap-4">
            <div className="bg-white w-[70%] h-full rounded-md flex flex-col items-start gap-4 p-4">
                <h1>Editor</h1>
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
                    <hr className="mt-6" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <label
                            htmlFor="leftTR"
                            className="flex flex-col items-start"
                        >
                            <span>Left Top Radius</span>
                            <input
                                type="number"
                                id="leftTR"
                                value={formState.leftTR}
                                onChange={handleChange}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                        <label
                            htmlFor="leftBR"
                            className="flex flex-col items-start"
                        >
                            <span>Left Bottom Radius</span>
                            <input
                                type="number"
                                id="leftBR"
                                value={formState.leftBR}
                                onChange={handleChange}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                        <label
                            htmlFor="rightTR"
                            className="flex flex-col items-start"
                        >
                            <span>Right Top Radius</span>
                            <input
                                type="number"
                                id="rightTR"
                                value={formState.rightTR}
                                onChange={handleChange}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                        <label
                            htmlFor="rightBR"
                            className="flex flex-col items-start"
                        >
                            <span>Right Bottom Radius</span>
                            <input
                                type="number"
                                id="rightBR"
                                value={formState.rightBR}
                                onChange={handleChange}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                    </div>
                    <hr className="mt-6" />
                    <div className="grid grid-cols-1 gap-4 mt-6">
                        <label
                            htmlFor="arcSelect"
                            className="flex flex-col items-start"
                        >
                            <span>Arc</span>
                            <select
                                id="arcSelect"
                                value={formState.arcSelect}
                                onChange={handleChange}
                                className="border rounded-md p-2 w-full block"
                            >
                                <option value="top">Верхняя</option>
                                <option value="right">Правая</option>
                                <option value="left">Левая</option>
                                <option value="bottom">Нижняя</option>
                            </select>
                        </label>
                        <label
                            htmlFor="arc"
                            className="flex flex-col items-start"
                        >
                            <input
                                type="number"
                                id="arc"
                                value={formState.arc}
                                onChange={handleChange}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                    </div>
                </form>
            </div>
            <div className="bg-white w-full h-full rounded-md">
                <CanvasView data={formState} />
            </div>
        </div>
    );
};

interface CanvaProps {
    data: {
        width: number;
        height: number;
        leftTR: number;
        leftBR: number;
        rightTR: number;
        rightBR: number;
        arc: number;
        arcSelect: string;
    };
}

const METER_TO_PX = 100; // метров в пиксели
const CM_TO_PX = 1; // см в пиксели

const CanvasView: React.FC<CanvaProps> = ({ data }) => {
    const canvaRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvaRef.current) {
            const ctx = canvaRef.current.getContext("2d");
            const w = data.width * METER_TO_PX; // Ширина в пикселях
            const h = data.height * METER_TO_PX; // Высота в пикселях
            const arcSelect = data.arcSelect; // Выбранная сторона: "top", "bottom", "right", "left"
            const maxArcHeight =
                arcSelect === "top" || arcSelect === "bottom" ? h / 2 : w / 2;
            let arcHeight = data.arc * CM_TO_PX; // Высота дуги в пикселях
            arcHeight = Math.min(arcHeight, maxArcHeight); // Ограничиваем максимальную высоту дуги

            const x = 10,
                y = 10; // Верхний левый угол прямоугольника

            if (ctx) {
                // Очищаем холст
                ctx.clearRect(
                    0,
                    0,
                    canvaRef.current.width,
                    canvaRef.current.height
                );

                // Начинаем новый путь
                ctx.beginPath();

                switch (arcSelect) {
                    case "top":
                        // Начинаем чуть ниже верхнего левого угла
                        ctx.moveTo(x, y + arcHeight);
                        // Линия вниз по левой стороне
                        ctx.lineTo(x, y + h);
                        // Линия вправо по нижней стороне
                        ctx.lineTo(x + w, y + h);
                        // Линия вверх по правой стороне до начала дуги
                        ctx.lineTo(x + w, y + arcHeight);
                        // Верхняя дуга через контрольную точку
                        ctx.quadraticCurveTo(x + w / 2, y, x, y + arcHeight);
                        break;

                    case "bottom":
                        // Начинаем в верхнем левом углу
                        ctx.moveTo(x, y);
                        // Линия вправо по верхней стороне
                        ctx.lineTo(x + w, y);
                        // Линия вниз по правой стороне до начала дуги
                        ctx.lineTo(x + w, y + h - arcHeight);
                        // Нижняя дуга через контрольную точку
                        ctx.quadraticCurveTo(
                            x + w / 2,
                            y + h,
                            x,
                            y + h - arcHeight
                        );
                        // Линия вверх по левой стороне
                        ctx.lineTo(x, y);
                        break;

                    case "right":
                        // Начинаем в верхнем левом углу
                        ctx.moveTo(x, y);
                        // Линия вправо по верхней стороне до начала дуги
                        ctx.lineTo(x + w - arcHeight, y);
                        // Правая дуга через контрольную точку
                        ctx.quadraticCurveTo(
                            x + w,
                            y + h / 2,
                            x + w - arcHeight,
                            y + h
                        );
                        // Линия влево по нижней стороне
                        ctx.lineTo(x, y + h);
                        // Линия вверх по левой стороне
                        ctx.lineTo(x, y);
                        break;

                    case "left":
                        // Начинаем чуть правее верхнего левого угла
                        ctx.moveTo(x + arcHeight, y);
                        // Левая дуга через контрольную точку
                        ctx.quadraticCurveTo(
                            x,
                            y + h / 2,
                            x + arcHeight,
                            y + h
                        );
                        // Линия вправо по нижней стороне
                        ctx.lineTo(x + w, y + h);
                        // Линия вверх по правой стороне
                        ctx.lineTo(x + w, y);
                        // Линия влево по верхней стороне до начала дуги
                        ctx.lineTo(x + arcHeight, y);
                        break;

                    default:
                        // Если не выбрана сторона для дуги, рисуем обычный прямоугольник
                        ctx.rect(x, y, w, h);
                        break;
                }

                // Закрываем путь
                ctx.closePath();

                // Настраиваем стиль обводки
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;

                // (Опционально) Заливаем фигуру
                // ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
                // ctx.fill();

                // Рисуем обводку
                ctx.stroke();
            }
        }
    }, [data]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <canvas ref={canvaRef} width={500} height={500}></canvas>
        </div>
    );
};

export default Editor;
