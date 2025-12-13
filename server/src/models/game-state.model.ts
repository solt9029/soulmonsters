import { GameStateEntity } from '../entities/game-state.entity';
import { StateType } from '../graphql/index';
import { GameCardModel } from './game-card.model';

type State =
  | {
      type: StateType.ATTACK_COUNT;
      data: { value: number };
    }
  | {
      type: StateType.SELF_POWER_CHANGE;
      data: { attack: number; defence: number };
    }
  | {
      type: StateType.PUT_SOUL_COUNT;
      data: { value: number; gameUserId: number };
    }
  | {
      type: StateType.EFFECT_RUTERUTE_DRAW_COUNT;
      data: { value: number };
    };

export class GameStateModel {
  constructor(partial?: Partial<GameStateModel>) {
    Object.assign(this, partial);
  }

  id: number;
  gameCard: GameCardModel | null;
  state: State;
  createdAt: Date;
  updatedAt: Date;

  toEntity(): GameStateEntity {
    return new GameStateEntity({
      id: this.id,
      gameCard: this.gameCard?.toEntity(),
      state: this.state,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
