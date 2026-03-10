import type { GameLogFragment } from '../../graphql/generated/graphql-client';

interface Props {
  gameLogs: GameLogFragment[];
}

export default function GameLogs({ gameLogs }: Props) {
  const sortedGameLogs = [...gameLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="game-logs">
      <div className="game-logs-header">ゲームログ</div>
      <div className="game-logs-list">
        {sortedGameLogs.map((log) => {
          const time = new Date(log.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          return (
            <div key={log.id} className="game-logs-item">
              <span>{log.message}</span>
              <span className="game-logs-time">{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
