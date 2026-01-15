import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameStateModel } from 'src/models/game-state.model';
import { StateType } from 'src/graphql/index';
import { drawCardFromDeck } from 'src/game/actions/handlers/effectRuteruteDraw/drawCardFromDeck';

export const resolveRuteruteDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): void => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return;
  }

  drawCardFromDeck(gameModel, gameChainLink.userId);

  const existsState = gameModel.gameStates.find(
    gs => gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gs.gameCardId === gameCard.id,
  );

  if (existsState) {
    gameModel.gameStates = gameModel.gameStates.map(gs =>
      gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gs.gameCardId === gameCard.id
        ? new GameStateModel({
            ...gs,
            state: {
              type: StateType.EFFECT_RUTERUTE_DRAW_COUNT,
              data: { value: gs.state.data.value + 1 },
            },
          })
        : gs,
    );
  } else {
    const newGameState = new GameStateModel({
      gameCardId: gameCard.id,
      state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    gameModel.gameStates = [...gameModel.gameStates, newGameState];
  }
};
