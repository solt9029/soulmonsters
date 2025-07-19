import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';

export async function handleStartEndTimeAction(manager: EntityManager, id: number) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  await gameRepository.update({ id }, { phase: Phase.END });
}
