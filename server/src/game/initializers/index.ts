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

  const userId = deckCardEntities[0]?.deck.userId;
  if (!userId) {
    return [];
  }

  const cardEntities: CardEntity[] = ([] as CardEntity[]).concat(
    ...deckCardEntities.map(value => new Array<CardEntity>(value.count).fill(value.card)),
  );
  const shuffledCardEntities = shuffle(cardEntities);

  return shuffledCardEntities.map((value, index) => {
    const gameCardEntity = new GameCardEntity({
      originalUserId: userId,
      currentUserId: userId,
      zone: index >= HAND_COUNT ? Zone.DECK : Zone.HAND,
      position: index >= HAND_COUNT ? index - HAND_COUNT : index,
      card: value,
      game: new GameEntity({ id: gameId }),
    });

    return gameCardEntity;
  });
}
