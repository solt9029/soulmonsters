import { CardEntity } from 'src/entities/card.entity';
import { DeckCardEntity } from 'src/entities/deck.card.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const HAND_COUNT = 5;

function shuffle<T>(array: T[]): T[] {
  const oldArray = [...array];
  let newArray = new Array<T>();
  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length);
    newArray = newArray.concat(oldArray.splice(i, 1));
  }
  return newArray;
}

export function initializeGameCards(deckCardEntities: DeckCardEntity[], gameId: number): GameCardEntity[] {
  if (deckCardEntities.length <= 0) {
    return [];
  }

  const userId = deckCardEntities[0].deck.userId;

  const cardEntities: CardEntity[] = deckCardEntities.map(value => new Array(value.count).fill(value.card)).flat();
  const shuffledCardEntities = shuffle(cardEntities);

  return shuffledCardEntities.map((value, index) => {
    const gameCardEntity = new GameCardEntity();

    gameCardEntity.originalUserId = userId;
    gameCardEntity.currentUserId = userId;
    gameCardEntity.zone = index >= HAND_COUNT ? Zone.DECK : Zone.HAND;
    gameCardEntity.position = index >= HAND_COUNT ? index - HAND_COUNT : index;
    gameCardEntity.card = value;
    gameCardEntity.game = new GameEntity();
    gameCardEntity.game.id = gameId;

    return gameCardEntity;
  });
}
