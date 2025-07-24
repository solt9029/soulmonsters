import { Zone } from 'src/graphql';
import { Phase } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameCardEntity } from 'src/entities/game.card.entity';

const calcTopDeckGameCardId = (gameEntity: GameEntity, userId: string): number | undefined => {
  const deckGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.DECK && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return deckGameCards[0]?.id;
};

const calcNewHandGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const handGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.HAND && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return handGameCards[0] ? handGameCards[0].position + 1 : 0;
};

const calcNextGameTurnCount = (gameEntity: GameEntity): number => {
  return gameEntity.turnCount + 1;
};

const updateGamePhaseAndTurn = (gameEntity: GameEntity): GameEntity => {
  gameEntity.phase = Phase.DRAW;
  gameEntity.turnCount = calcNextGameTurnCount(gameEntity);

  return gameEntity;
};

const drawCardFromDeck = (gameEntity: GameEntity, userId: string): GameEntity => {
  const topDeckGameCardId = calcTopDeckGameCardId(gameEntity, userId);

  if (topDeckGameCardId === undefined) {
    // TODO: the opponent user wins
    return gameEntity;
  }

  const newPosition = calcNewHandGameCardPosition(gameEntity, userId);

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === topDeckGameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.HAND,
          position: newPosition,
        })
      : gameCard,
  );

  return gameEntity;
};

export async function handleStartDrawTimeAction(manager: EntityManager, userId: string, gameEntity: GameEntity) {
  gameEntity = updateGamePhaseAndTurn(gameEntity);
  gameEntity = drawCardFromDeck(gameEntity, userId);

  await manager.save(GameEntity, gameEntity);
}
