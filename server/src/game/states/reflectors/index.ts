import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { Zone, StateType } from 'src/graphql';
import { Injectable } from '@nestjs/common';

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
  filteredGameCardModel.actionTypes = gameCardModel.actionTypes;

  return filteredGameCardModel;
}

@Injectable()
export class GameStateReflector {
  reflectStates(gameModel: GameModel, userId: string): GameModel {
    gameModel.gameCards = gameModel.gameCards
      .map(gameCard => addInfo(gameCard))
      .map(gameCard => filterByUserId(gameCard, userId))
      .map(gameCard => this.applyPowerDownEffects(gameCard, gameModel));

    return gameModel;
  }

  private applyPowerDownEffects(gameCard: GameCardModel, gameModel: GameModel): GameCardModel {
    const powerDownState = gameModel.gameStates.find(
      state =>
        state.state.type === StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN &&
        state.state.data.targetGameCardId === gameCard.id,
    );

    if (powerDownState && powerDownState.state.type === StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN) {
      const newAttack = (gameCard.attack || 0) - powerDownState.state.data.value;
      gameCard.attack = newAttack < 0 ? 0 : newAttack;
    }

    return gameCard;
  }
}
