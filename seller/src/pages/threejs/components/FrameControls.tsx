import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FrameControlsProps {
    width: number
    height: number
    profileWidth: number
    elements: Record<string, boolean>
    onChange: (data: any) => void
}

export function FrameControls({
    width,
    height,
    profileWidth,
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
                    onChange={(e) => onChange({ width: +e.target.value, height, profileWidth, elements })}
                />
            </div>
            <div>
                <Label>Высота (м)</Label>
                <Input
                    type="number"
                    value={height}
                    onChange={(e) => onChange({ width, height: +e.target.value, profileWidth, elements })}
                />
            </div>
            <div>
                <Label>Толщина профиля (м)</Label>
                <Input
                    type="number"
                    step="0.05"
                    value={profileWidth}
                    onChange={(e) => onChange({ width, height, profileWidth: +e.target.value, elements })}
                />
            </div>
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
                                    profileWidth,
                                    elements: { ...elements, [key]: !value },
                                })
                            }
                        />
                        <span className="capitalize">{key}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
