import { Zone } from '../../graphql';

export enum GameEventType {
  ZONE_CHANGED = 'ZONE_CHANGED',
}

export type ZoneChangedEvent = {
  type: GameEventType.ZONE_CHANGED;
  gameCardId: number;
  fromZone: Zone;
  toZone: Zone;
};

export type GameEvent = ZoneChangedEvent;
