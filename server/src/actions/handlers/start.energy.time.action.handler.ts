import { Phase } from '../../graphql/index';
import { GameRepository } from 'src/repositories/game.repository';
import { GameUserRepository } from '../../repositories/game.user.repository';
import { GameEntity } from '../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

const calcNewEnergy = (gameEntity: GameEntity, userId: string): number | undefined => {
  const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!yourGameUser) {
    return undefined;
  }

  let newEnergy = yourGameUser.energy + 2;

  if (newEnergy > 8) {
    newEnergy = 8;
  }

  return newEnergy;
};

export async function handleStartEnergyTimeAction(
  manager: EntityManager,
  id: number,
  userId: string,
  gameEntity: GameEntity,
) {
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);
  const gameRepository = manager.getCustomRepository(GameRepository);

  const newEnergy = calcNewEnergy(gameEntity, userId);

  if (newEnergy === undefined) {
    throw new BadRequestException('User Not Found');
  }

  await gameUserRepository.update({ userId, game: { id } }, { energy: newEnergy });
  await gameRepository.update({ id }, { phase: Phase.ENERGY });
}
