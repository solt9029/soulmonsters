import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import {
  type GameCardFragment,
  BattlePosition,
  Zone,
} from '../../../graphql/generated/graphql-client';
import { useGameCardClick } from '../../../hooks/useGameCardClick';
import { BACK_SIDE_CARD } from '../../../constants/pictures';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

const CARD_W = 1.4;
const CARD_H = 2.0;
const CARD_D = 0.02;
const HOVER_FLOAT = 0.3;
const BASE_Y_FLAT = 0.025;

export type ThreeGameCardProps = {
  data: GameCardFragment;
  gameId: number;
  position: [number, number, number];
  zone: Zone;
};

function CardMesh({
  data,
  gameId,
  position,
  zone,
  frontTexture,
  backTexture,
}: ThreeGameCardProps & {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
}) {
  const {
    state: { actionStatus },
  } = useContext(AppContext);

  const { handleClick } = useGameCardClick(data, gameId);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const isHand = zone === Zone.Hand;
  const isDefence = !isHand && data.battlePosition === BattlePosition.Defence;
  const isSelected =
    actionStatus.payload.costGameCardIds?.includes(data.id) ||
    actionStatus.payload.targetGameCardIds?.includes(data.id) ||
    false;

  useFrame(() => {
    if (!meshRef.current || isHand) return;
    const targetY = hovered ? BASE_Y_FLAT + HOVER_FLOAT : BASE_Y_FLAT;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.12,
    );
  });

  const sideColor = isSelected ? '#ff3300' : '#1a1a1a';

  // BoxGeometry face order: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
  // Flat (rotation=[0,0,0]): +Y face (mat2) faces up → front texture visible from camera above
  // Standing (rotation=[π/2,0,0]): +Y local (mat2) → world +Z → faces camera
  const materials = [
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshStandardMaterial({
      map: frontTexture,
      emissive: new THREE.Color(isSelected ? '#ff2200' : '#000000'),
      emissiveIntensity: isSelected ? 0.5 : 0,
    }),
    new THREE.MeshStandardMaterial({ map: backTexture }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
  ];

  const rotation: [number, number, number] = isHand
    ? [Math.PI / 2, 0, 0]
    : [0, isDefence ? Math.PI / 2 : 0, 0];

  const posY = isHand ? CARD_H / 2 : BASE_Y_FLAT;

  return (
    <mesh
      ref={meshRef}
      position={[position[0], posY, position[2]]}
      rotation={rotation}
      material={materials}
      onPointerDown={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      castShadow
    >
      <boxGeometry args={[CARD_W, CARD_D, CARD_H]} />
    </mesh>
  );
}

export default function ThreeGameCard(props: ThreeGameCardProps) {
  const frontUrl = props.data.card?.picture ?? BACK_SIDE_CARD;
  const [frontTexture, backTexture] = useTexture([frontUrl, BACK_SIDE_CARD]);

  return <CardMesh {...props} frontTexture={frontTexture} backTexture={backTexture} />;
}
