import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

function isVisibleForAll(zone: Zone) {
  return zone === Zone.BATTLE || zone === Zone.SOUL || zone === Zone.MORGUE;
}

function isVisibleForCurrentUser(zone: Zone) {
  return zone === Zone.HAND;
}

function addInfo(gameCardEntity: GameCardEntity) {
  gameCardEntity.name = gameCardEntity.card.name;
  gameCardEntity.kind = gameCardEntity.card.kind;
  gameCardEntity.type = gameCardEntity.card.type;
  gameCardEntity.attribute = gameCardEntity.card.attribute;
  gameCardEntity.attack = gameCardEntity.card.attack;
  gameCardEntity.defence = gameCardEntity.card.defence;
  gameCardEntity.cost = gameCardEntity.card.cost;
  gameCardEntity.detail = gameCardEntity.card.detail;
  return gameCardEntity;
}

function filterByUserId(gameCardEntity: GameCardEntity, userId: string): GameCardEntity {
  if (
    isVisibleForAll(gameCardEntity.zone) ||
    (gameCardEntity.currentUserId === userId && isVisibleForCurrentUser(gameCardEntity.zone))
  ) {
    return gameCardEntity;
  }

  const filteredGameCardEntity = new GameCardEntity();
  filteredGameCardEntity.id = gameCardEntity.id;
  filteredGameCardEntity.currentUserId = gameCardEntity.currentUserId;
  filteredGameCardEntity.originalUserId = gameCardEntity.originalUserId;
  filteredGameCardEntity.zone = gameCardEntity.zone;
  filteredGameCardEntity.position = gameCardEntity.position;

  return filteredGameCardEntity;
}

// TODO: この算出ロジックは、多分Gameのactionをhandleする前にも実行しておくべき。
export const reflectStatus = (gameEntity: GameEntity, userId: string): GameEntity => {
  gameEntity.gameCards = gameEntity.gameCards
    .map(gameCard => addInfo(gameCard))
    .map(gameCard => filterByUserId(gameCard, userId));

  // TODO: GameStateに応じてGameCardの情報を適宜書き換える
  //   例: 「このカードが存在する限り相手モンスターの攻撃力が100下がる」などがあれば、その情報をgameCardに反映する。

  return gameEntity;
};
