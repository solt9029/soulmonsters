export default function TableMesh() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 26]} />
        <meshStandardMaterial
          color="#1a3a2a"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[28, 0.05]} />
        <meshStandardMaterial color="#2a5a3a" />
      </mesh>
    </>
  );
}
