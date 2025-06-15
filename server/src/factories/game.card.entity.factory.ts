import { GameEntity } from './../entities/game.entity';
import { CardEntity } from '../entities/card.entity';
import { DeckCardEntity } from '../entities/deck.card.entity';
import { GameCardEntity } from '../entities/game.card.entity';
import { Injectable } from '@nestjs/common';
import { Zone } from 'src/graphql';

function shuffle<T>(array: T[]): T[] {
  const oldArray = [...array];
  let newArray = new Array<T>();
  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length);
    newArray = newArray.concat(oldArray.splice(i, 1));
  }
  return newArray;
}

function isVisibleForAll(zone: Zone) {
  return zone === Zone.BATTLE || zone === Zone.SOUL || zone === Zone.MORGUE;
}

function isVisibleForCurrentUser(zone: Zone) {
  return zone === Zone.HAND;
}

@Injectable()
export class GameCardEntityFactory {
  private static get HAND_COUNT() {
    return 5;
  }

  create(deckCardEntities: DeckCardEntity[], gameId: number): GameCardEntity[] {
    if (deckCardEntities.length <= 0) {
      return [];
    }

    const userId = deckCardEntities[0].deck.userId;

    const cardEntities: CardEntity[] = deckCardEntities.flatMap(value => {
      return new Array(value.count).fill(value.card);
    });
    const shuffledCardEntities = shuffle(cardEntities);

    return shuffledCardEntities.map((value, index) => {
      const gameCardEntity = new GameCardEntity();

      gameCardEntity.originalUserId = userId;
      gameCardEntity.currentUserId = userId;
      gameCardEntity.zone =
        index >= GameCardEntityFactory.HAND_COUNT ? Zone.DECK : Zone.HAND;
      gameCardEntity.position =
        index >= GameCardEntityFactory.HAND_COUNT
          ? index - GameCardEntityFactory.HAND_COUNT
          : index;
      gameCardEntity.card = value;
      gameCardEntity.game = new GameEntity();
      gameCardEntity.game.id = gameId;

      return gameCardEntity;
    });
  }

  addInfo(gameCardEntity: GameCardEntity) {
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

  filterByUserId(
    gameCardEntity: GameCardEntity,
    userId: string,
  ): GameCardEntity {
    if (
      isVisibleForAll(gameCardEntity.zone) ||
      (gameCardEntity.currentUserId === userId &&
        isVisibleForCurrentUser(gameCardEntity.zone))
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
}
