import { BadRequestException } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { ActionType, GameActionDispatchInput } from 'src/graphql/index';
import { validateSelectAsHamontakiTargetAction } from './selectAsHamontakiTarget';

describe('validateSelectAsHamontakiTargetAction', () => {
  it('should not throw when valid gameCard is provided', () => {
    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [ActionType.SELECT_AS_HAMONTAKI_TARGET],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const input: GameActionDispatchInput = {
      type: ActionType.SELECT_AS_HAMONTAKI_TARGET,
      payload: {
        gameCardId: 1,
      },
    };

    const result = validateSelectAsHamontakiTargetAction(input, gameModel);

    expect(result.targetGameCard).toBe(gameCard);
  });

  it('should throw BadRequestException when gameCardId is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    const input: GameActionDispatchInput = {
      type: ActionType.SELECT_AS_HAMONTAKI_TARGET,
      payload: {},
    };

    expect(() => validateSelectAsHamontakiTargetAction(input, gameModel)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard is not found', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    const input: GameActionDispatchInput = {
      type: ActionType.SELECT_AS_HAMONTAKI_TARGET,
      payload: {
        gameCardId: 1,
      },
    };

    expect(() => validateSelectAsHamontakiTargetAction(input, gameModel)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard does not have SELECT_AS_HAMONTAKI_TARGET action type', () => {
    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const input: GameActionDispatchInput = {
      type: ActionType.SELECT_AS_HAMONTAKI_TARGET,
      payload: {
        gameCardId: 1,
      },
    };

    expect(() => validateSelectAsHamontakiTargetAction(input, gameModel)).toThrow(BadRequestException);
  });
});
