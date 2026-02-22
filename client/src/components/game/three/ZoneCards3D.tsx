import {
  Zone,
  type GameCardFragment,
} from '../../../graphql/generated/graphql-client';
import ThreeGameCard from './ThreeGameCard';
import ThreeGameCardStack from './ThreeGameCardStack';

const CARD_SPACING = 1.6;

type ZoneKey = `${Zone}_${'player' | 'opponent'}`;

const ZONE_POSITIONS: Record<ZoneKey, [number, number, number]> = {
  [`${Zone.Hand}_player`]: [0, 0, 7.75],
  [`${Zone.Battle}_player`]: [0, 0, 2],
  [`${Zone.Soul}_player`]: [-0, 0, 5],
  [`${Zone.Morgue}_player`]: [5.5, 0, 5],
  [`${Zone.Deck}_player`]: [5.5, 0, 2],
  [`${Zone.Hand}_opponent`]: [0, 0, -7.75],
  [`${Zone.Battle}_opponent`]: [0, 0, -2],
  [`${Zone.Soul}_opponent`]: [0, 0, -5],
  [`${Zone.Morgue}_opponent`]: [-5.5, 0, -5],
  [`${Zone.Deck}_opponent`]: [-5.5, 0, -2],
};

const STACK_ZONES = new Set([Zone.Deck, Zone.Morgue]);

export type ZoneCards3DProps = {
  gameCards: GameCardFragment[];
  zone: Zone;
  isYours: boolean;
  gameId: number;
};

export default function ZoneCards3D({
  gameCards,
  zone,
  isYours,
  gameId,
}: ZoneCards3DProps) {
  const key: ZoneKey = `${zone}_${isYours ? 'player' : 'opponent'}`;
  const center = ZONE_POSITIONS[key];

  if (STACK_ZONES.has(zone)) {
    return <ThreeGameCardStack gameCards={gameCards} position={center} />;
  }

  const count = gameCards.length;

  return (
    <>
      {gameCards.map((card, i) => {
        const offsetX = (i - (count - 1) / 2) * CARD_SPACING;
        return (
          <ThreeGameCard
            key={card.id}
            data={card}
            gameId={gameId}
            zone={zone}
            isYours={isYours}
            position={[center[0] + offsetX, center[1], center[2]]}
          />
        );
      })}
    </>
  );
}
