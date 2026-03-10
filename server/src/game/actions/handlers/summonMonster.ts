import { GameModel } from '../../../models/game.model';
import { subtractUserEnergy } from '../../mutations/subtractUserEnergy';
import { moveGameCardToBattle } from '../../mutations/moveGameCardToBattle';
import { packHandPositions } from '../../mutations/packHandPositions';
import { SummonMonsterActionPayload } from '../validators/summonMonster';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export function handleSummonMonsterAction(
  userId: string,
  payload: SummonMonsterActionPayload,
  gameModel: GameModel,
): GameModel {
  const gameCard = gameModel.gameCards.find(value => value.id === payload.gameCardId);
  if (!gameCard) {
    throw new Error(`GameCard with id ${payload.gameCardId} not found`);
  }

  const originalPosition = gameCard.position;

  gameModel = subtractUserEnergy(gameModel, userId, payload.cost);
  gameModel = moveGameCardToBattle(gameModel, userId, payload.gameCardId);
  gameModel = packHandPositions(gameModel, userId, originalPosition);
  gameModel = addGameLog(gameModel, `${getDisplayName(gameModel, userId)}が${gameCard.card.name}を召喚しました。`);

  return gameModel;
}
