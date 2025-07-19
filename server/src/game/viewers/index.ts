import { GameCardEntity } from 'src/entities/game.card.entity';
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

export const buildViewableGameCards = (gameCards: GameCardEntity[], userId: string): GameCardEntity[] => {
  return gameCards.map(gameCard => addInfo(gameCard)).map(gameCard => filterByUserId(gameCard, userId));
};
