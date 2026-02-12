import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveNisekisanchouEnergyIncrease = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  gameModel = addUserEnergy(gameModel, gameChainLink.userId, 2);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
