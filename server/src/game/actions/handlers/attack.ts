import { GameModel } from '../../../models/game.model';
import { directAttack } from '../../mutations/attack/directAttack';
import { monsterBattle } from '../../mutations/attack/monsterBattle';
import { incrementEffectUseCount } from '../../mutations/incrementCountStateValue';
import { packBattlePositions } from '../../mutations/packBattlePositions';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { StateType } from 'src/graphql';

export type AttackActionPayload =
  | {
      type: 'DIRECT_ATTACK';
      attackerCard: GameCardModel;
      opponentGameUser: GameUserModel;
      attackerUserId: string;
    }
  | {
      type: 'MONSTER_BATTLE';
      attackerCard: GameCardModel;
      targetCard: GameCardModel;
      attackerUserId: string;
      opponentUserId: string;
    };

export function handleAttackAction(userId: string, payload: AttackActionPayload, gameModel: GameModel): GameModel {
  if (payload.type === 'DIRECT_ATTACK') {
    directAttack(gameModel, payload.attackerCard.id, payload.opponentGameUser.userId);
    incrementEffectUseCount(gameModel, payload.attackerCard, StateType.ATTACK_COUNT);
    return gameModel;
  }

  const originalGameCardPosition = payload.attackerCard.position;
  const originalTargetGameCardPosition = payload.targetCard.position;

  gameModel = monsterBattle(gameModel, payload.attackerCard.id, payload.targetCard.id);
  gameModel = incrementEffectUseCount(gameModel, payload.attackerCard, StateType.ATTACK_COUNT);

  const updatedGameCardZone = gameModel.gameCards.find(gameCard => gameCard.id === payload.attackerCard.id)?.zone;
  const updatedTargetGameCardZone = gameModel.gameCards.find(gameCard => gameCard.id === payload.targetCard.id)?.zone;

  if (updatedGameCardZone !== 'BATTLE' && originalGameCardPosition) {
    gameModel = packBattlePositions(gameModel, userId, originalGameCardPosition);
  }

  if (updatedTargetGameCardZone !== 'BATTLE' && originalTargetGameCardPosition) {
    gameModel = packBattlePositions(gameModel, payload.opponentUserId, originalTargetGameCardPosition);
  }

  return gameModel;
}
