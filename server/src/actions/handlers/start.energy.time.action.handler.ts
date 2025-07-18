import { Phase } from '../../graphql/index';
import { GameRepository } from 'src/repositories/game.repository';
import { GameUserRepository } from '../../repositories/game.user.repository';
import { GameEntity } from '../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export async function handleStartEnergyTimeAction(
  manager: EntityManager,
  id: number,
  userId: string,
  gameEntity: GameEntity,
) {
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);
  const gameRepository = manager.getCustomRepository(GameRepository);

  const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!yourGameUser) {
    throw new BadRequestException('User Not Found');
  }

  let newEnergy = yourGameUser.energy + 2;

  if (newEnergy > 8) {
    newEnergy = 8;
  }

  await gameUserRepository.update({ userId, game: { id } }, { energy: newEnergy });
  await gameRepository.update({ id }, { phase: Phase.ENERGY });
}
