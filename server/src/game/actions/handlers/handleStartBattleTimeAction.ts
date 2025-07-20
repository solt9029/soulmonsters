import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';

export async function handleStartBattleTimeAction(manager: EntityManager, id: number) {
  const gameRepository = manager.getRepository(GameRepository.target).extend(GameRepository);
  await gameRepository.update({ id }, { phase: Phase.BATTLE });
}
