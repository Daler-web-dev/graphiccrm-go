import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"

interface Props {
    modelPath: string
    position?: [number, number, number]
    width?: number
    height?: number
    scale?: [number, number, number]
    rotation?: [number, number, number]
}

export function Model({
    modelPath,
    position = [0, 0, 0],
    scale,
    rotation = [0, 0, 0],
}: Props) {
    const { scene } = useGLTF(modelPath)
    const cloned = useMemo(() => scene.clone(), [scene])

    return (
        <primitive
            object={cloned}
            position={position}
            scale={scale}
            rotation={rotation}
        />
    )
}
