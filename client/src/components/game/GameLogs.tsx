import type { GameLogFragment } from '../../graphql/generated/graphql-client';

interface Props {
  gameLogs: GameLogFragment[];
}

export default function GameLogs({ gameLogs }: Props) {
  return (
    <div className="game-logs">
      <div className="game-logs-header">ゲームログ</div>
      <div className="game-logs-list">
        {gameLogs.map((log) => (
          <div key={log.id} className="game-logs-item">
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
