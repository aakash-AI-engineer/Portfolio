import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

function WireframeGlobe() {
  const system = useRef(null);
  const geometry = useRef(null);

  useEffect(() => {
    const sphere = geometry.current;
    if (!sphere || sphere.userData.warped) return;
    const positions = sphere.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      const length = Math.hypot(x, y, z);
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;
      const wave =
        Math.sin(nx * 3.2 + ny * 1.8) * Math.cos(nz * 2.8 - ny * 1.3) +
        Math.sin(ny * 4.1 + nz * 2.2) * 0.4;
      const radius = 2.55 + wave * 0.21;
      positions.setXYZ(index, nx * radius, ny * radius, nz * radius);
    }
    positions.needsUpdate = true;
    sphere.computeVertexNormals();
    sphere.userData.warped = true;
  }, []);

  useFrame((state, delta) => {
    if (!system.current) return;
    system.current.rotation.y += delta * 0.035;
    system.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08 + state.pointer.y * 0.08;
    system.current.rotation.z = state.pointer.x * 0.08;
  });

  return (
    <group ref={system} rotation={[0.15, 0.1, -0.12]}>
      <mesh>
        <sphereGeometry ref={geometry} args={[2.55, 48, 36]} />
        <meshBasicMaterial color="#a919ef" wireframe transparent opacity={0.31} />
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
