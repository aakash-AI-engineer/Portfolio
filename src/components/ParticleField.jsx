import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function WireframeGlobe() {
  const system = useRef(null);

  useFrame((state, delta) => {
    if (!system.current) return;
    system.current.rotation.y += delta * 0.035;
    system.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08 + state.pointer.y * 0.08;
    system.current.rotation.z = state.pointer.x * 0.08;
  });

  return (
    <group ref={system} rotation={[0.15, 0.1, -0.12]}>
      <mesh>
        <icosahedronGeometry args={[2.55, 3]} />
        <meshBasicMaterial color="#a919ef" wireframe transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[0.45, 0.3, 0.1]}>
        <torusGeometry args={[1.72, 0.012, 8, 128]} />
        <meshBasicMaterial color="#ff2a54" transparent opacity={0.82} />
      </mesh>
      <mesh rotation={[1.1, -0.5, 0.5]}>
        <torusGeometry args={[1.84, 0.008, 8, 128]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function SpaceDust() {
  const points = useMemo(() => {
    const positions = new Float32Array(900);
    for (let index = 0; index < positions.length; index += 3) {
      const seed = index / 3;
      positions[index] = Math.sin(seed * 127.1) * 5.4;
      positions[index + 1] = Math.cos(seed * 311.7) * 3.8;
      positions[index + 2] = -1 - ((seed * 73.3) % 8);
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dce8ff" size={0.018} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        frameloop={reducedMotion ? "demand" : "always"}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 7.8], fov: 42 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={<div className="hero-scene-fallback" />}
      >
        <WireframeGlobe />
        <SpaceDust />
      </Canvas>
    </div>
  );
}
