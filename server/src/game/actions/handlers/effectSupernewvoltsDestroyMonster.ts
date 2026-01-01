import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { saveEffectUseCountGameState } from './effectSupernewvoltsDestroyMonster/saveEffectUseCountGameState';
import { moveDeckTopCardToMorgue } from './effectSupernewvoltsDestroyMonster/moveDeckTopCardToMorgue';
import { moveTargetMonsterToMorgue } from './effectSupernewvoltsDestroyMonster/moveTargetMonsterToMorgue';

export type EffectSupernewvoltsDestroyMonsterActionPayload = {
  gameCard: GameCardModel;
  targetGameCard: GameCardModel;
};

export function handleEffectSupernewvoltsDestroyMonster(
  userId: string,
  payload: EffectSupernewvoltsDestroyMonsterActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = moveDeckTopCardToMorgue(gameModel, userId);
  gameModel = moveTargetMonsterToMorgue(gameModel, payload.targetGameCard);
  saveEffectUseCountGameState(gameModel, payload.gameCard);
  return gameModel;
}
