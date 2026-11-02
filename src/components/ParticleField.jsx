import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";

function OrbitalScene() {
  const system = useRef(null);
  const points = useMemo(() => {
    const positions = new Float32Array(540);
    for (let index = 0; index < positions.length; index += 3) {
      const radius = 2.5 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!system.current) return;
    system.current.rotation.y += delta * 0.075;
    system.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <>
      <group ref={system} rotation={[0.2, 0.15, -0.15]}>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.16}>
          <mesh>
            <icosahedronGeometry args={[1.3, 2]} />
            <meshBasicMaterial color="#37d9f5" wireframe transparent opacity={0.16} />
          </mesh>
          <mesh rotation={[0.45, 0.3, 0.1]}>
            <torusGeometry args={[1.85, 0.006, 8, 160]} />
            <meshBasicMaterial color="#ff3b5c" transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[1.1, -0.5, 0.5]}>
            <torusGeometry args={[2.15, 0.004, 8, 160]} />
            <meshBasicMaterial color="#37d9f5" transparent opacity={0.58} />
          </mesh>
        </Float>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[points, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#d9faff"
            size={0.025}
            transparent
            opacity={0.62}
            sizeAttenuation
          />
        </points>
      </group>
    </>
  );
}

export default function ParticleField() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div className="particle-field" aria-hidden="true">
      <Canvas
        frameloop={reducedMotion ? "demand" : "always"}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={<div className="particle-fallback" />}
      >
        <OrbitalScene />
      </Canvas>
    </div>
  );
}
