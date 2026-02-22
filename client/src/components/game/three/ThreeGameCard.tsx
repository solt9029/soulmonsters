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
const HOVER_FLOAT = 0.5;
const BASE_Y_FLAT = 0.025;
const BASE_Y_HAND = CARD_H / 2;

export type ThreeGameCardProps = {
  data: GameCardFragment;
  gameId: number;
  position: [number, number, number];
  zone: Zone;
  isYours: boolean;
};

function CardMesh({
  data,
  gameId,
  position,
  zone,
  isYours,
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
  const isDefence = data.battlePosition === BattlePosition.Defence;
  const isSelected =
    actionStatus.payload.costGameCardIds?.includes(data.id) ||
    actionStatus.payload.targetGameCardIds?.includes(data.id);

  useFrame(() => {
    if (!meshRef.current) return;
    const baseY = isHand ? BASE_Y_HAND : BASE_Y_FLAT;
    const targetY = hovered ? baseY + HOVER_FLOAT : baseY;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.12
    );
  });

  const sideColor = isSelected ? '#ff3300' : '#1a1a1a';

  // BoxGeometry face order: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
  // Flat (rotation=[0,0,0]): +Y face (mat2) faces up → front texture visible from camera above
  // Standing (rotation=[π/2,0,0]): +Y local (mat2) → world +Z → faces camera
  const materials = [
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshBasicMaterial({
      map: frontTexture,
      color: new THREE.Color(isSelected ? '#ff8866' : '#cccccc'),
    }),
    new THREE.MeshStandardMaterial({ map: backTexture }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
    new THREE.MeshStandardMaterial({ color: sideColor }),
  ];

  // Opponent flat cards are rotated 180° around Y so they face toward their own side
  const baseYRot = isHand ? 0 : isYours ? 0 : Math.PI;
  const rotation: [number, number, number] = isHand
    ? [(Math.PI / 2) * 0.4, 0, 0]
    : [0, baseYRot + (isDefence ? Math.PI / 2 : 0), 0];

  const posY = isHand ? BASE_Y_HAND : BASE_Y_FLAT;

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

  return (
    <CardMesh
      {...props}
      frontTexture={frontTexture}
      backTexture={backTexture}
    />
  );
}
