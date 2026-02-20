import { CARD_ID } from 'src/constants/card';
import { GameModel } from 'src/models/game.model';
import { Zone, ActionType, Phase, Attribute, Kind } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';

const MONSTER_KINDS: Kind[] = [Kind.MONSTER, Kind.CIRCLE_MONSTER];

// TODO: 計算効率は悪そうなので直したい（ヘドロンがバトルゾーンにない場合に）
export function grantUseHedronAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  const soulGameCardCount = gameModel.gameCards.filter(
    gameCard => gameCard.currentUserId === userId && gameCard.zone === Zone.SOUL,
  ).length;

  if (soulGameCardCount < 3) {
    return gameModel;
  }

  const hasPurpleMonsterInMorgue = gameModel.gameCards.some(
    gameCard =>
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.MORGUE &&
      gameCard.card != null &&
      MONSTER_KINDS.includes(gameCard.card.kind) &&
      gameCard.card.attribute === Attribute.PURPLE,
  );

  if (!hasPurpleMonsterInMorgue) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    if (gameCard.currentUserId !== userId || gameCard.zone !== Zone.BATTLE || gameCard.card?.id !== CARD_ID.HEDORON) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.USE_HEDRON],
    });
  });

  return gameModel;
}
