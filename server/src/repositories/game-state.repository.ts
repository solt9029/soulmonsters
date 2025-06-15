import { EntityRepository, Repository } from 'typeorm';
import { GameStateEntity } from '../entities/game.state.entity';

@EntityRepository(GameStateEntity)
export class GameStateRepository extends Repository<GameStateEntity> {
  // Add specific methods as needed for game state operations
}