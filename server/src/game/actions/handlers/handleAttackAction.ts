import { MAX_ENERGY } from '../../../constants/rule';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { GameEntity } from '../../../entities/game.entity';
import { Zone } from 'src/graphql';
import { GameStateRepository } from 'src/repositories/game.state.repository';
import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameUserRepository } from '../../../repositories/game.user.repository';
import { GameActionDispatchInput, BattlePosition, StateType } from '../../../graphql/index';
import { EntityManager } from 'typeorm';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameStateRepository = manager.getCustomRepository(GameStateRepository);

  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);
  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId);

  if (data.payload.targetGameUserIds?.length === 1) {
    await gameUserRepository.update(
      { id: opponentGameUser.id },
      { lifePoint: opponentGameUser.lifePoint - gameCard.attack },
    );

    // TODO: 本当はここではeventを単に保存した上で、あとからhandleActionとは別で処理してあげると良いかも？
    if (gameCard.card.id === 11) {
      // TODO: 冷徹な鳥（11）が直接攻撃をしたら2枚ドローできる
    }
  } else {
    const targetGameCard = gameEntity.gameCards.find(value => value.id === data.payload.targetGameCardIds[0]);
    const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);

    const newYourSoulGameCardPosition = calcNewSoulGameCardPosition(gameEntity, userId);
    const newOpponentSoulGameCardPosition = calcNewSoulGameCardPosition(gameEntity, opponentGameUser.userId);

    if (targetGameCard.battlePosition === BattlePosition.ATTACK) {
      if (gameCard.attack >= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: targetGameCard.id },
          { position: newOpponentSoulGameCardPosition, zone: Zone.SOUL },
        );

        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${opponentGameUser.id}" AND position > ${targetGameCard.position} ORDER BY position`,
        );

        if (opponentGameUser.energy < MAX_ENERGY) {
          await manager.update(GameUserEntity, { id: opponentGameUser.id }, { energy: opponentGameUser.energy + 1 });
        }
      }

      if (gameCard.attack <= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: gameCard.id },
          { position: newYourSoulGameCardPosition, zone: Zone.SOUL },
        );

        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${yourGameUser.id}" AND position > ${gameCard.position} ORDER BY position`,
        );

        if (yourGameUser.energy < MAX_ENERGY) {
          await manager.update(GameUserEntity, { id: yourGameUser.id }, { energy: yourGameUser.energy + 1 });
        }
      }

      if (gameCard.attack != targetGameCard.attack) {
        const damagePoint = Math.abs(gameCard.attack - targetGameCard.attack);
        const damagedGameUser = gameCard.attack > targetGameCard.attack ? opponentGameUser : yourGameUser;

        await gameUserRepository.update(
          { id: damagedGameUser.id },
          { lifePoint: damagedGameUser.lifePoint - damagePoint },
        );
      }
    }

    if (targetGameCard.battlePosition === BattlePosition.DEFENCE) {
      if (gameCard.attack > targetGameCard.defence) {
        await gameCardRepository.update(
          { id: targetGameCard.id },
          { position: newOpponentSoulGameCardPosition, zone: Zone.SOUL },
        );

        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${opponentGameUser.id}" AND position > ${targetGameCard.position} ORDER BY position`,
        );
      }

      if (gameCard.attack < targetGameCard.defence) {
        const damagePoint = targetGameCard.defence - gameCard.attack;

        await gameUserRepository.update(
          { id: yourGameUser.id },
          { lifePoint: opponentGameUser.lifePoint - damagePoint },
        );
      }
    }
  }

  // add attack count state
  const updatedGameCard = await gameCardRepository.findOne({
    id: data.payload.gameCardId,
  });

  const gameStates = await gameStateRepository.find({
    game: gameEntity,
    gameCard: updatedGameCard,
  });

  const attackCountGameState = gameStates.find(gameState => gameState.state.type === StateType.ATTACK_COUNT);

  if (updatedGameCard.zone === Zone.BATTLE) {
    if (attackCountGameState === undefined) {
      await gameStateRepository.insert({
        game: gameEntity,
        gameCard: updatedGameCard,
        state: { type: StateType.ATTACK_COUNT, data: { value: 1 } },
      });
      return;
    }

    await gameStateRepository.update(
      { id: attackCountGameState.id },
      {
        state: {
          type: StateType.ATTACK_COUNT,
          data: { value: attackCountGameState.state.data['value'] + 1 },
        },
      },
    );
  }
}
