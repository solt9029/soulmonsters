import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { BattlePosition, EffectType } from 'src/graphql/index';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

const getTargetGameCard = (gameModel: GameModel, gameChainLink: GameChainLinkModel) => {
  const targetGameCardId =
    gameChainLink.effect.type === EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION && gameChainLink.effect.targetGameCardId;

  return gameModel.gameCards.find(gameCard => gameCard.id === targetGameCardId);
};

export const resolveSpeedDragonBirdChangePosition = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const targetGameCard = getTargetGameCard(gameModel, gameChainLink);

  if (!targetGameCard) {
    return gameModel;
  }

  const newBattlePosition =
    targetGameCard.battlePosition === BattlePosition.ATTACK ? BattlePosition.DEFENCE : BattlePosition.ATTACK;

  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === targetGameCard.id
      ? new GameCardModel({
          ...gameCard,
          battlePosition: newBattlePosition,
        })
      : gameCard,
  );

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(
    gameModel,
    `${CARD_NAME.SPEEDDRAGONANDSPEEDBIRD}の効果を処理し、${targetGameCard.card.name}の表示形式を変更しました。`,
  );

  return gameModel;
};
