import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react"

interface Props {
    width: number
    height: number
    depth: number
    elements: Record<string, boolean>
}

export function FrameScene({ width, height, depth, elements }: Props) {
    const w = width / 2
    const h = height / 2
    const p = depth / 2

    const fullWidth = Math.floor(width)
    const fullHeight = Math.floor(height)

    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
                {elements.nalichnik && (
                    <>
                        {Array.from({ length: fullWidth }).map((_, i) => (
                            <mesh key={`top-${i}`} position={[-w + i + 0.5, h - p, 0]}>
                                <boxGeometry args={[1, depth, 0.1]} />
                                <meshStandardMaterial />
                            </mesh>
                        ))}
                        {Array.from({ length: fullHeight }).map((_, i) => (
                            <mesh key={`left-${i}`} position={[-w + p, h - i - 0.5, 0]}>
                                <boxGeometry args={[depth, 1, 0.1]} />
                                <meshStandardMaterial />
                            </mesh>
                        ))}
                        {Array.from({ length: fullHeight }).map((_, i) => (
                            <mesh key={`right-${i}`} position={[w - p, h - i - 0.5, 0]}>
                                <boxGeometry args={[depth, 1, 0.1]} />
                                <meshStandardMaterial />
                            </mesh>
                        ))}
                    </>
                )}
                {elements.zamok && (
                    <mesh position={[0, h + 0.2, 0.05]}>
                        <boxGeometry args={[0.5, 0.4, 0.2]} />
                        <meshStandardMaterial color={"lightgray"} />
                    </mesh>
                )}
                {elements.podokonnik &&
                    Array.from({ length: fullWidth }).map((_, i) => (
                        <mesh key={`podokonnik-${i}`} position={[-w + 0.5 + i, -h - p - 0.05, 0]}>
                            <boxGeometry args={[1, depth + 0.1, 0.1]} />
                            <meshStandardMaterial color="lightgray" />
                        </mesh>
                    ))
                }
                {elements.kronshtein && (
                    <>
                        <mesh position={[-w + 0.3, -h - p - (depth + 0.2), 0]}>
                            <boxGeometry args={[0.3, 0.3, 0.1]} />
                            <meshStandardMaterial color={"gray"} />
                        </mesh>
                        <mesh position={[w - 0.3, -h - p - (depth + 0.2), 0]}>
                            <boxGeometry args={[0.3, 0.3, 0.1]} />
                            <meshStandardMaterial color={"gray"} />
                        </mesh>
                    </>
                )}
            </Suspense>
            <OrbitControls />
        </Canvas>
    )
}
