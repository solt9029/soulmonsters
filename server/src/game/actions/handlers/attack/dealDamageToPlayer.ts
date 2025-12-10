import { GameUserEntity } from 'src/entities/game-user.entity';
import { GameEntity } from '../../../../entities/game.entity';

export const dealDamageToPlayer = (gameEntity: GameEntity, userId: string, damage: number): GameEntity => {
  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, lifePoint: gameUser.lifePoint - damage }) : gameUser,
  );

  return gameEntity;
};
