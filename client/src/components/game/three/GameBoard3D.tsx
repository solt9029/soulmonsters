import { Suspense, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Zone,
  type GameCardFragment,
} from '../../../graphql/generated/graphql-client';
import { AppContext } from '../../../contexts/AppContext';
import { findGameCards } from '../../../utils/game';
import TableMesh from './TableMesh';
import ZoneCards3D from './ZoneCards3D';
import FloatingSouls from './FloatingSouls';

const ALL_ZONES = [Zone.Hand, Zone.Battle, Zone.Soul, Zone.Morgue, Zone.Deck];

export type GameBoard3DProps = {
  gameId: number;
  gameCards: GameCardFragment[] | undefined;
};

export default function GameBoard3D({ gameId, gameCards }: GameBoard3DProps) {
  const {
    state: { user },
  } = useContext(AppContext);

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 22, 7], fov: 45 }}
      shadows
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 15, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffffff" />

      <TableMesh />
      <FloatingSouls />

      <Suspense fallback={null}>
        {ALL_ZONES.map((zone) => (
          <ZoneCards3D
            key={`player-${zone}`}
            gameCards={findGameCards(gameCards, user, { zone, isYours: true })}
            zone={zone}
            isYours={true}
            gameId={gameId}
          />
        ))}
        {ALL_ZONES.map((zone) => (
          <ZoneCards3D
            key={`opponent-${zone}`}
            gameCards={findGameCards(gameCards, user, { zone, isYours: false })}
            zone={zone}
            isYours={false}
            gameId={gameId}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}
