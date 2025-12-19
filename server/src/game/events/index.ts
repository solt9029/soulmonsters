import { Zone } from '../../graphql';

export enum GameEventType {
  ZONE_CHANGED = 'ZONE_CHANGED',
  DIRECT_ATTACK = 'DIRECT_ATTACK',
}

export type ZoneChangedEvent = {
  type: GameEventType.ZONE_CHANGED;
  gameCardId: number;
  fromZone: Zone;
  toZone: Zone;
};

export type DirectAttackEvent = {
  type: GameEventType.DIRECT_ATTACK;
  attackerCardId: number;
  opponentUserId: string;
};

export type GameEvent = ZoneChangedEvent | DirectAttackEvent;
