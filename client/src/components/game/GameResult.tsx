import { useState } from 'react';

interface Props {
  isWinner: boolean;
}

export default function GameResult({ isWinner }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`game-result-overlay ${isWinner ? 'game-result-victory' : 'game-result-defeat'}`}
      onClick={() => setDismissed(true)}
    >
      <div className="game-result-content">
        <div className="game-result-divider" />
        <div className="game-result-main-text">
          {isWinner ? 'VICTORY' : 'DEFEAT'}
        </div>
        <div className="game-result-divider" />
        <div className="game-result-sub-text">
          {isWinner ? '勝利しました！' : '敗北しました。'}
        </div>
      </div>
    </div>
  );
}
