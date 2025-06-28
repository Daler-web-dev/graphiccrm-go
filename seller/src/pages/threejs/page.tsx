import { useState } from "react"
import { FrameScene } from "./components/FrameScene"
import { FrameControls } from "./components/FrameControls"


export const Threejs = () => {
    const [frame, setFrame] = useState({
        width: 2,
        height: 3,
        depth: 0.1,
        elements: {
            nalichnik: true,
            podokonnik: true,
            zamok: true,
            sandrik: true,
            kronshtein: true,
        },
    })

    function getEstimate() {
        const { width, height, depth } = frame
        const perimeter = 2 * (width + height)
        const innerWidth = width - 2 * depth
        const innerHeight = height - 2 * depth
        const area = (width * height) - (innerWidth * innerHeight)
        const pricePerMeter = 15
        const cost = perimeter * pricePerMeter
        return { perimeter, area, cost }
    }

    const { perimeter, area, cost } = getEstimate()

    return (
        <div className="flex h-screen">
            <div className="w-80 p-4 bg-white border-r overflow-y-auto">
                <FrameControls {...frame} onChange={setFrame} />
                <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p>📏 Периметр: {perimeter.toFixed(2)} м</p>
                    <p>📐 Площадь: {area.toFixed(2)} м²</p>
                    <p>💸 Стоимость: ${cost.toFixed(2)}</p>
                </div>
            </div>
            <div className="w-[calc(100%-320px)] flex-1">
                <FrameScene {...frame} />
            </div>
        </div>
    )
}