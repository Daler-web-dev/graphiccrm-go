import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react"

interface Props {
    width: number
    height: number
    profileWidth: number
    elements: Record<string, boolean>
}

export function FrameScene({ width, height, profileWidth, elements }: Props) {
    const w = width / 2
    const h = height / 2
    const p = profileWidth / 2

    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
                {elements.nalichnik && (
                    <>
                        {/* Top */}
                        <mesh position={[0, h - p, 0]}>
                            <boxGeometry args={[width, profileWidth, 0.1]} />
                            <meshStandardMaterial />
                        </mesh>

                        {/* Left */}
                        <mesh position={[-w + p, 0, 0]}>
                            <boxGeometry args={[profileWidth, height, 0.1]} />
                            <meshStandardMaterial />
                        </mesh>
                        {/* Right */}
                        <mesh position={[w - p, 0, 0]}>
                            <boxGeometry args={[profileWidth, height, 0.1]} />
                            <meshStandardMaterial />
                        </mesh>
                    </>
                )}
                {elements.zamok && (
                    <mesh position={[0, h + 0.2, 0]}>
                        <boxGeometry args={[0.5, 0.3, 0.1]} />
                        <meshStandardMaterial />
                    </mesh>
                )}
                {elements.podokonnik && (
                    <mesh position={[0, -h + p, 0]}>
                        <boxGeometry args={[width, profileWidth, 0.1]} />
                        <meshStandardMaterial />
                    </mesh>
                )}
            </Suspense>
            <OrbitControls />
        </Canvas>
    )
}
