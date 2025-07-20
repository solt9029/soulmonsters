import { AppDataSource } from '../dataSource';
import { GameStateEntity } from '../entities/game.state.entity';

export const GameStateRepository = AppDataSource.getRepository(GameStateEntity).extend({});
