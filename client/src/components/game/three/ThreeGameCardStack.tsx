import { useContext } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { type GameCardFragment } from '../../../graphql/generated/graphql-client';
import { AppContext } from '../../../contexts/AppContext';
import { findTopGameCard } from '../../../utils/game';
import { BACK_SIDE_CARD } from '../../../constants/pictures';

const CARD_W = 1.4;
const CARD_H = 2.0;
const CARD_D = 0.02;
const STACK_OFFSET = 0.015;
const STACK_COUNT = 3;

export type ThreeGameCardStackProps = {
  gameCards: GameCardFragment[];
  position: [number, number, number];
  isYours: boolean;
};

function StackMeshes({
  targetGameCards,
  position,
  topTexture,
  backTexture,
  isYours,
}: {
  targetGameCards: GameCardFragment[];
  position: [number, number, number];
  topTexture: THREE.Texture;
  backTexture: THREE.Texture;
  isYours: boolean;
}) {
  const {
    state: { gameCardListModal },
    dispatch,
  } = useContext(AppContext);

  if (targetGameCards.length <= 0) return null;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    dispatch({
      type: 'SET_GAME_CARD_LIST_MODAL',
      payload: gameCardListModal.open(targetGameCards),
    });
  };

  const visibleCount = Math.min(targetGameCards.length, STACK_COUNT);

  return (
    <>
      {Array.from({ length: visibleCount }).map((_, i) => {
        const isTop = i === visibleCount - 1;
        const yPos = position[1] + CARD_D / 2 + i * STACK_OFFSET;

        // BoxGeometry face order: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
        // No rotation (flat on table): +Y face (mat2) faces up = visible from camera above
        const materials = [
          new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
          new THREE.MeshBasicMaterial({
            map: isTop ? topTexture : backTexture,
          }),
          new THREE.MeshStandardMaterial({ map: backTexture }),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
        ];

        // Apply same rotation logic as ThreeGameCard: opponent cards are rotated 180° around Y
        const baseYRot = isYours ? 0 : Math.PI;

        return (
          <mesh
            key={i}
            position={[position[0], yPos, position[2]]}
            rotation={[0, baseYRot, 0]}
            material={materials}
            onPointerDown={isTop ? handleClick : undefined}
            onPointerEnter={
              isTop
                ? () => {
                    document.body.style.cursor = 'pointer';
                  }
                : undefined
            }
            onPointerLeave={
              isTop
                ? () => {
                    document.body.style.cursor = 'default';
                  }
                : undefined
            }
          >
            <boxGeometry args={[CARD_W, CARD_D, CARD_H]} />
          </mesh>
        );
      })}
    </>
  );
}

function ThreeGameCardStackInner({
  gameCards,
  position,
  isYours,
}: ThreeGameCardStackProps) {
  const topGameCard = findTopGameCard(gameCards);
  const topUrl = topGameCard?.card?.picture ?? BACK_SIDE_CARD;

  const [topTexture, backTexture] = useTexture([topUrl, BACK_SIDE_CARD]);

  return (
    <StackMeshes
      targetGameCards={gameCards}
      position={position}
      topTexture={topTexture}
      backTexture={backTexture}
      isYours={isYours}
    />
  );
}

export default function ThreeGameCardStack(props: ThreeGameCardStackProps) {
  return <ThreeGameCardStackInner {...props} />;
}
