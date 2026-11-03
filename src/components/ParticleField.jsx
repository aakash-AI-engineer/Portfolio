import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

function surfaceRadius(x, y, z, time) {
  const wave =
    Math.sin(x * 3.2 + y * 1.8 + time * 1.25) *
      Math.cos(z * 2.8 - y * 1.3 + time * 0.9) +
    Math.sin(y * 4.1 + z * 2.2 + time * 1.1) * 0.4;
  return 2.55 + wave * 0.21;
}

function surfacePoint(x, y, z, time) {
  const radius = surfaceRadius(x, y, z, time);
  return [x * radius, y * radius, z * radius];
}

function WireframeGlobe() {
  const system = useRef(null);
  const geometry = useRef(null);
  const nodeAttribute = useRef(null);
  const connectionAttribute = useRef(null);
  const elapsed = useRef(0);
  const neuralNetwork = useMemo(() => {
    const nodeCount = 48;
    const directions = [];
    const connectionIndices = [];
    const linkedPairs = new Set();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < nodeCount; index += 1) {
      const y = 1 - (index / (nodeCount - 1)) * 2;
      const horizontalRadius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;
      const x = Math.cos(angle) * horizontalRadius;
      const z = Math.sin(angle) * horizontalRadius;
      directions.push(x, y, z);

      const nearest = [];
      for (let candidateIndex = 0; candidateIndex < index; candidateIndex += 1) {
        const start = candidateIndex * 3;
        const distance =
          (directions[start] - x) ** 2 +
          (directions[start + 1] - y) ** 2 +
          (directions[start + 2] - z) ** 2;
        nearest.push({ candidateIndex, distance });
      }
      nearest
        .sort((first, second) => first.distance - second.distance)
        .slice(0, 3)
        .forEach(({ candidateIndex }) => {
          const pair = `${candidateIndex}:${index}`;
          if (linkedPairs.has(pair)) return;
          linkedPairs.add(pair);
          connectionIndices.push(candidateIndex, index);
        });
    }

    const nodeDirections = new Float32Array(directions);
    const linkDirections = new Float32Array(connectionIndices);
    const nodes = new Float32Array(nodeDirections.length);
    const connections = new Float32Array(linkDirections.length * 3);
    for (let index = 0; index < nodeDirections.length / 3; index += 1) {
      nodes.set(surfacePoint(
        nodeDirections[index * 3],
        nodeDirections[index * 3 + 1],
        nodeDirections[index * 3 + 2],
        0,
      ), index * 3);
    }
    for (let index = 0; index < linkDirections.length; index += 1) {
      const directionIndex = linkDirections[index] * 3;
      connections.set(surfacePoint(
        nodeDirections[directionIndex],
        nodeDirections[directionIndex + 1],
        nodeDirections[directionIndex + 2],
        0,
      ), index * 3);
    }

    return {
      nodeDirections,
      linkDirections,
      nodes,
      connections,
    };
  }, []);

  useEffect(() => {
    const sphere = geometry.current;
    if (!sphere || sphere.userData.directions) return;
    const positions = sphere.attributes.position;
    const directions = new Float32Array(positions.count * 3);
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      const length = Math.hypot(x, y, z);
      directions.set([x / length, y / length, z / length], index * 3);
    }
    sphere.userData.directions = directions;
    for (let index = 0; index < positions.count; index += 1) {
      const directionIndex = index * 3;
      const x = directions[directionIndex];
      const y = directions[directionIndex + 1];
      const z = directions[directionIndex + 2];
      const radius = surfaceRadius(x, y, z, 0);
      positions.setXYZ(index, x * radius, y * radius, z * radius);
    }
    positions.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!system.current) return;
    elapsed.current += delta * 1.5;
    const time = elapsed.current;
    system.current.rotation.y += delta * 0.19;
    system.current.rotation.x = Math.sin(time * 0.2) * 0.08 + state.pointer.y * 0.08;
    system.current.rotation.z = state.pointer.x * 0.08;

    const sphere = geometry.current;
    const sphereDirections = sphere?.userData.directions;
    if (sphereDirections) {
      const positions = sphere.attributes.position;
      for (let index = 0; index < positions.count; index += 1) {
        const directionIndex = index * 3;
        const x = sphereDirections[directionIndex];
        const y = sphereDirections[directionIndex + 1];
        const z = sphereDirections[directionIndex + 2];
        const radius = surfaceRadius(x, y, z, time);
        positions.setXYZ(index, x * radius, y * radius, z * radius);
      }
      positions.needsUpdate = true;
    }

    const nodes = nodeAttribute.current;
    if (nodes) {
      for (let index = 0; index < neuralNetwork.nodeDirections.length / 3; index += 1) {
        const directionIndex = index * 3;
        const x = neuralNetwork.nodeDirections[directionIndex];
        const y = neuralNetwork.nodeDirections[directionIndex + 1];
        const z = neuralNetwork.nodeDirections[directionIndex + 2];
        const radius = surfaceRadius(x, y, z, time);
        nodes.setXYZ(index, x * radius, y * radius, z * radius);
      }
      nodes.needsUpdate = true;
    }

    const connections = connectionAttribute.current;
    if (connections) {
      for (let index = 0; index < neuralNetwork.linkDirections.length; index += 1) {
        const directionIndex = neuralNetwork.linkDirections[index] * 3;
        const x = neuralNetwork.nodeDirections[directionIndex];
        const y = neuralNetwork.nodeDirections[directionIndex + 1];
        const z = neuralNetwork.nodeDirections[directionIndex + 2];
        const radius = surfaceRadius(x, y, z, time);
        connections.setXYZ(index, x * radius, y * radius, z * radius);
      }
      connections.needsUpdate = true;
    }
  });

  return (
    <group ref={system} rotation={[0.15, 0.1, -0.12]}>
      <mesh>
        <sphereGeometry ref={geometry} args={[2.55, 48, 36]} />
        <meshBasicMaterial color="#a919ef" wireframe transparent opacity={0.31} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={connectionAttribute}
            attach="attributes-position"
            args={[neuralNetwork.connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a45bff" transparent opacity={0.34} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={nodeAttribute}
            attach="attributes-position"
            args={[neuralNetwork.nodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#d7a8ff"
          size={0.045}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
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
