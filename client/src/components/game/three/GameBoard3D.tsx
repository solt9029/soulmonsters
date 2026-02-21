import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Zone,
  type GameCardFragment,
} from '../../../graphql/generated/graphql-client';
import TableMesh from './TableMesh';
import ZoneCards3D from './ZoneCards3D';

const ALL_ZONES = [Zone.Hand, Zone.Battle, Zone.Soul, Zone.Morgue, Zone.Deck];

export type GameBoard3DProps = {
  gameId: number;
  gameCards: GameCardFragment[] | undefined;
};

export default function GameBoard3D({ gameId, gameCards }: GameBoard3DProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 13, 20], fov: 45 }}
      shadows
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 15, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#4466aa" />

      <TableMesh />

      <Suspense fallback={null}>
        {ALL_ZONES.map((zone) => (
          <ZoneCards3D
            key={`player-${zone}`}
            gameCards={gameCards}
            zone={zone}
            isYours={true}
            gameId={gameId}
          />
        ))}
        {ALL_ZONES.map((zone) => (
          <ZoneCards3D
            key={`opponent-${zone}`}
            gameCards={gameCards}
            zone={zone}
            isYours={false}
            gameId={gameId}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}
