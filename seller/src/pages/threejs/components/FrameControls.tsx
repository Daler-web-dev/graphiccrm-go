import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FrameControlsProps {
    width: number
    height: number
    depth: number
    elements: Record<string, boolean>
    onChange: (data: any) => void
}

const Elements: any = {
    nalichnik: "Наличник",
    podokonnik: "Подоконник",
    zamok: "Замок",
    sandrik: "Сандрик",
    kronshtein: "Кронштеин"
}

export function FrameControls({
    width,
    height,
    depth,
    elements,
    onChange,
}: FrameControlsProps) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label>Ширина (м)</Label>
                <Input
                    type="number"
                    value={width}
                    onChange={(e) => onChange({ width: +e.target.value, height, depth, elements })}
                />
            </div>
            <div>
                <Label>Высота (м)</Label>
                <Input
                    type="number"
                    value={height}
                    onChange={(e) => onChange({ width, height: +e.target.value, depth, elements })}
                />
            </div>
            {/* <div>
                <Label>Толщина профиля (м)</Label>
                <Input
                    type="number"
                    step="0.1"
                    value={depth}
                    onChange={(e) => onChange({ width, height, profileWidth: +e.target.value, elements })}
                    min={0.1}
                />
            </div> */}
            <div className="space-y-2">
                <Label>Элементы оформления:</Label>
                {Object.entries(elements).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={() =>
                                onChange({
                                    width,
                                    height,
                                    depth,
                                    elements: { ...elements, [key]: !value },
                                })
                            }
                        />
                        <span className="capitalize">{Elements[key]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
