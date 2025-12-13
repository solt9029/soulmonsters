import { GameCardRepository } from '../../../repositories/game-card.repository';
import { GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameModel: GameModel,
) {
  const gameCard = gameModel.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;

  subtractUserEnergy(gameModel, userId, gameCard.card.cost!);
  summonGameCard(gameModel, userId, data.payload.gameCardId!);

  // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

  await manager.save(gameModel.toEntity());

  // 本当は new GameCardRepository のタイミングで connection を渡す必要は実際はない（packHandPositionsで別途managerを渡すから）。ただし、渡さないといけないから仕方なく渡している。仕方なく渡しているmanager.connectionが使われてしまうとまずいので（別のentityManagerが生成されてしまう）、必ずpackHandPositionsではmanagerを渡すように！！
  // TODO: GameCardRepositoryをDIしたい
  const gameCardRepository = new GameCardRepository(manager.connection);
  await gameCardRepository.packHandPositions(gameModel.id, userId, originalPosition, manager);
}
