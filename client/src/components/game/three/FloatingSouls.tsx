import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SOUL_COUNT = 7;

const SOUL_COLORS = ['#88aaff', '#aaddff', '#cc99ff', '#99eeff', '#ffffff'];

type SoulData = {
  originX: number;
  originZ: number;
  speed: number;
  phase: number;
  color: string;
  size: number;
};

// 球体の下半分を引き伸ばして裾に波を付け、幽霊/魂の形にする
const createSoulGeometry = (size: number): THREE.BufferGeometry => {
  const geo = new THREE.SphereGeometry(size, 12, 14);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (y >= 0) continue;

    const t = Math.abs(y) / size; // 0(赤道)〜1(南極)
    const angle = Math.atan2(z, x);
    const r = Math.sqrt(x * x + z * z);

    // 下方向に引き伸ばしてテール生成
    const newY = y - t * t * size * 0.9;

    // 裾に3波の揺れ（布の裾っぽく）
    const wave =
      t > 0.3 ? Math.sin(angle * 3 + Math.PI / 4) * t * size * 0.2 : 0;
    const newR = r * (1 - t * 0.2) + wave;

    pos.setXYZ(
      i,
      r > 0.0001 ? (x / r) * newR : x,
      newY,
      r > 0.0001 ? (z / r) * newR : z
    );
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
};

export default function FloatingSouls() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const souls = useMemo<SoulData[]>(
    () =>
      Array.from({ length: SOUL_COUNT }, () => ({
        originX: (Math.random() - 0.5) * 22,
        originZ: (Math.random() - 0.5) * 22,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        color: SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)],
        size: 0.12 + Math.random() * 0.14,
      })),
    []
  );

  const geometries = useMemo(
    () => souls.map((s) => createSoulGeometry(s.size)),
    [souls]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = souls[i];
      const age = ((t * s.speed + s.phase) % (Math.PI * 2)) / (Math.PI * 2); // 0〜1

      mesh.position.x =
        s.originX +
        Math.sin(t * s.speed * 0.6 + s.phase) * 3.5 +
        Math.sin(t * s.speed * 0.22 + s.phase * 1.7) * 1.8;
      mesh.position.z =
        s.originZ +
        Math.cos(t * s.speed * 0.5 + s.phase) * 3.5 +
        Math.cos(t * s.speed * 0.18 + s.phase * 2.1) * 1.8;
      mesh.position.y = 0.3 + age * 5.5 + Math.sin(t * 1.4 + s.phase) * 0.25;

      // ゆらゆら揺れる
      mesh.rotation.y = Math.sin(t * 0.7 + s.phase) * 0.25;
      mesh.rotation.z = Math.sin(t * 0.4 + s.phase + 1.2) * 0.08;

      const opacity =
        age < 0.15
          ? age / 0.15
          : age > 0.75
            ? (1 - age) / 0.25
            : 0.6 + Math.sin(t * 2.5 + s.phase) * 0.15;

      (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(
        0,
        opacity
      );
    });
  });

  return (
    <>
      {souls.map((soul, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometries[i]}
        >
          <meshStandardMaterial
            color={soul.color}
            emissive={soul.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
            roughness={0.25}
            metalness={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
