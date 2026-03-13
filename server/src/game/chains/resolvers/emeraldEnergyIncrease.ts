import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

export const resolveEmeraldEnergyIncrease = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  gameModel = addUserEnergy(gameModel, gameChainLink.userId, 1);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(gameModel, `${CARD_NAME.MORINOMUROSAEMERARL}の効果を処理し、エナジーが1増えました。`);

  return gameModel;
};
