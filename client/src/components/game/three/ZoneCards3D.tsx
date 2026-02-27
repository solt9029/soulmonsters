import {
  Zone,
  type GameCardFragment,
} from '../../../graphql/generated/graphql-client';
import ThreeGameCard from './ThreeGameCard';
import ThreeGameCardStack from './ThreeGameCardStack';

const CARD_SPACING = 1.6;
const DECK_SIDE_BOUNDARY = 3.0;

type ZoneKey = `${Zone}_${'player' | 'opponent'}`;

const ZONE_POSITIONS: Record<ZoneKey, [number, number, number]> = {
  [`${Zone.Hand}_player`]: [0, 0, 7.75],
  [`${Zone.Battle}_player`]: [0, 0, 2],
  [`${Zone.Soul}_player`]: [-0, 0, 5],
  [`${Zone.Morgue}_player`]: [5.5, 0, 2],
  [`${Zone.Deck}_player`]: [5.5, 0, 5],
  [`${Zone.Hand}_opponent`]: [0, 0, -7.75],
  [`${Zone.Battle}_opponent`]: [0, 0, -2],
  [`${Zone.Soul}_opponent`]: [0, 0, -5],
  [`${Zone.Morgue}_opponent`]: [-5.5, 0, -2],
  [`${Zone.Deck}_opponent`]: [-5.5, 0, -5],
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
    return (
      <ThreeGameCardStack
        gameCards={gameCards}
        position={center}
        isYours={isYours}
      />
    );
  }

  const count = gameCards.length;
  const naturalHalfSpread = ((count - 1) / 2) * CARD_SPACING; // 基本的には中央に並べていく
  const deckSideDirection = isYours ? 1 : -1;
  const overshoot =
    zone === Zone.Battle || zone === Zone.Soul
      ? Math.max(0, naturalHalfSpread - DECK_SIDE_BOUNDARY)
      : 0; // バトルとソウルゾーンのカードが、デッキとモルグゾーンに侵食しないように、はみ出そうな時は調整する
  const effectiveCenterX = center[0] - deckSideDirection * overshoot;

  return (
    <>
      {gameCards.map((gameCard, i) => {
        const offsetX = (i - (count - 1) / 2) * CARD_SPACING;
        return (
          <ThreeGameCard
            key={gameCard.id}
            data={gameCard}
            gameId={gameId}
            zone={zone}
            isYours={isYours}
            position={[effectiveCenterX + offsetX, center[1], center[2]]}
          />
        );
      })}
    </>
  );
}
