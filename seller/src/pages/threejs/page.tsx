import { useState } from "react"
import { FrameScene } from "./components/FrameScene"
import { FrameControls } from "./components/FrameControls"


export const Threejs = () => {
    const [frame, setFrame] = useState({
        width: 2,
        height: 3,
        profileWidth: 0.1,
        elements: {
            zamok: true,
            podokonnik: true,
            nalichnik: true,
            sandrik: false,
            kronshtein: false,
        },
    })

    function getEstimate() {
        const { width, height, profileWidth } = frame
        const perimeter = 2 * (width + height)
        const innerWidth = width - 2 * profileWidth
        const innerHeight = height - 2 * profileWidth
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
            <div className="flex-1">
                <FrameScene {...frame} />
            </div>
        </div>
    )
}