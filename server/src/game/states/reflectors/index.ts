import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';

function isVisibleForAll(zone: Zone) {
  return zone === Zone.BATTLE || zone === Zone.SOUL || zone === Zone.MORGUE;
}

function isVisibleForCurrentUser(zone: Zone) {
  return zone === Zone.HAND;
}

function addInfo(gameCardModel: GameCardModel) {
  gameCardModel.name = gameCardModel.card.name;
  gameCardModel.kind = gameCardModel.card.kind;
  gameCardModel.type = gameCardModel.card.type;
  gameCardModel.attribute = gameCardModel.card.attribute;
  gameCardModel.attack = gameCardModel.card.attack;
  gameCardModel.defence = gameCardModel.card.defence;
  gameCardModel.cost = gameCardModel.card.cost;
  gameCardModel.detail = gameCardModel.card.detail;
  return gameCardModel;
}

function filterByUserId(gameCardModel: GameCardModel, userId: string): GameCardModel {
  if (
    isVisibleForAll(gameCardModel.zone) ||
    (gameCardModel.currentUserId === userId && isVisibleForCurrentUser(gameCardModel.zone))
  ) {
    return gameCardModel;
  }

  const filteredGameCardModel = new GameCardModel();
  filteredGameCardModel.id = gameCardModel.id;
  filteredGameCardModel.currentUserId = gameCardModel.currentUserId;
  filteredGameCardModel.originalUserId = gameCardModel.originalUserId;
  filteredGameCardModel.zone = gameCardModel.zone;
  filteredGameCardModel.position = gameCardModel.position;

  return filteredGameCardModel;
}

// TODO: この算出ロジックは、多分Gameのactionをhandleする前にも実行しておくべき。
export const reflectStates = (gameModel: GameModel, userId: string): GameModel => {
  gameModel.gameCards = gameModel.gameCards
    .map(gameCard => addInfo(gameCard))
    .map(gameCard => filterByUserId(gameCard, userId));

  // TODO: GameStateに応じてGameCardの情報を適宜書き換える
  //   例: 「このカードが存在する限り相手モンスターの攻撃力が100下がる」などがあれば、その情報をgameCardに反映する。

  return gameModel;
};
