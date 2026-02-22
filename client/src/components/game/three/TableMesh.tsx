import * as THREE from 'three';

type ZoneRectProps = {
  position: [number, number, number];
  width?: number;
  depth?: number;
  color: string;
  emissive: string;
};

function ZoneRect({
  position,
  width = 1.9,
  depth = 2.4,
  color,
  emissive,
}: ZoneRectProps) {
  const t = 0.06;
  const h = 0.012;
  const ei = 2.0;
  const corners: Array<[number, number]> = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  return (
    <group position={position}>
      {/* Inner glow fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, h - 0.006, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.25}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
      {/* Border: top */}
      <mesh position={[0, h, -(depth / 2)]}>
        <boxGeometry args={[width + t, 0.008, t]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={ei}
        />
      </mesh>
      {/* Border: bottom */}
      <mesh position={[0, h, depth / 2]}>
        <boxGeometry args={[width + t, 0.008, t]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={ei}
        />
      </mesh>
      {/* Border: left */}
      <mesh position={[-(width / 2), h, 0]}>
        <boxGeometry args={[t, 0.008, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={ei}
        />
      </mesh>
      {/* Border: right */}
      <mesh position={[width / 2, h, 0]}>
        <boxGeometry args={[t, 0.008, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={ei}
        />
      </mesh>
      {/* Corner accents */}
      {corners.map(([sx, sz]) => (
        <mesh
          key={`${sx}_${sz}`}
          position={[(sx * width) / 2, h + 0.003, (sz * depth) / 2]}
        >
          <boxGeometry args={[t * 2, 0.012, t * 2]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={ei * 1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

const SEAL_ANGLES = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];

export default function TableMesh() {
  return (
    <>
      {/* ── BASE FIELD ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 26]} />
        <meshStandardMaterial
          color="#0a1520"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Player side (z > 0) blue tint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 6.5]}>
        <planeGeometry args={[28, 13]} />
        <meshStandardMaterial
          color="#0d2040"
          transparent
          opacity={0.65}
          roughness={0.9}
          depthWrite={false}
        />
      </mesh>
      {/* Opponent side (z < 0) red tint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -6.5]}>
        <planeGeometry args={[28, 13]} />
        <meshStandardMaterial
          color="#2a0810"
          transparent
          opacity={0.65}
          roughness={0.9}
          depthWrite={false}
        />
      </mesh>

      {/* ── CENTER DIVIDER ── */}
      {/* Outer soft glow band */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[26, 0.8]} />
        <meshStandardMaterial
          color="#1a3355"
          emissive="#334488"
          emissiveIntensity={1.0}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      {/* Main bright line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <planeGeometry args={[26, 0.12]} />
        <meshStandardMaterial
          color="#99ccff"
          emissive="#77aaff"
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* ── CENTER ORNAMENTAL SEAL ── */}
      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[2.2, 2.45, 48]} />
        <meshStandardMaterial
          color="#aaccff"
          emissive="#88aaff"
          emissiveIntensity={2.0}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[1.4, 1.6, 48]} />
        <meshStandardMaterial
          color="#aaccff"
          emissive="#88aaff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Inner dark fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <circleGeometry args={[1.4, 48]} />
        <meshStandardMaterial
          color="#112244"
          emissive="#223366"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
      {/* Center glow point */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}>
        <circleGeometry args={[0.28, 24]} />
        <meshStandardMaterial
          color="#ccddff"
          emissive="#aabbff"
          emissiveIntensity={4.0}
        />
      </mesh>
      {/* Diagonal seal lines */}
      {SEAL_ANGLES.map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0085, 0]}>
            <planeGeometry args={[4.8, 0.04]} />
            <meshStandardMaterial
              color="#aaccff"
              emissive="#88aaff"
              emissiveIntensity={1.5}
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* ── ZONE OUTLINES ── */}
      {/* Player:
          Battle x=0  w=8 → edge x=4   gap=0.55 to Deck   (x=5.5, edge=4.55)
          Soul   x=-4.5 w=8 → edge x=0.5 no overlap w/ Morgue (x=5.5) */}
      <ZoneRect
        position={[-1.5, 0, 3.5]}
        width={11}
        depth={2.8}
        color="#0044cc"
        emissive="#0088ff"
      />
      <ZoneRect
        position={[-1.5, 0, 6.5]}
        width={11}
        depth={2.8}
        color="#0044cc"
        emissive="#0088ff"
      />
      <ZoneRect position={[5.5, 0, 6.5]} color="#0044cc" emissive="#0088ff" />
      <ZoneRect position={[5.5, 0, 3.5]} color="#0044cc" emissive="#0088ff" />
      {/* Opponent (mirrored):
          Battle x=0  w=8 → edge x=4   gap=0.55 to Deck   (x=-5.5, edge=-4.55)
          Soul   x=4.5 w=8 → edge x=0.5 no overlap w/ Morgue (x=-5.5) */}
      <ZoneRect
        position={[1.5, 0, -3.5]}
        width={11}
        depth={2.8}
        color="#cc2200"
        emissive="#ff5500"
      />
      <ZoneRect
        position={[1.5, 0, -6.5]}
        width={11}
        depth={2.8}
        color="#cc2200"
        emissive="#ff5500"
      />
      <ZoneRect position={[-5.5, 0, -6.5]} color="#cc2200" emissive="#ff5500" />
      <ZoneRect position={[-5.5, 0, -3.5]} color="#cc2200" emissive="#ff5500" />

      {/* ── PERIMETER BORDER ── */}
      <mesh position={[0, 0.15, -13.15]}>
        <boxGeometry args={[28.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#1a2233"
          emissive="#223344"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.15, 13.15]}>
        <boxGeometry args={[28.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#1a2233"
          emissive="#223344"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-14.15, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 26.6]} />
        <meshStandardMaterial
          color="#1a2233"
          emissive="#223344"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[14.15, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 26.6]} />
        <meshStandardMaterial
          color="#1a2233"
          emissive="#223344"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Border inner glow rims */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -12.85]}>
        <planeGeometry args={[27.7, 0.05]} />
        <meshStandardMaterial
          color="#4488cc"
          emissive="#3366aa"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 12.85]}>
        <planeGeometry args={[27.7, 0.05]} />
        <meshStandardMaterial
          color="#4488cc"
          emissive="#3366aa"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
