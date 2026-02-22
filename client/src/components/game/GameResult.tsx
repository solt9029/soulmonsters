import { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  isWinner: boolean;
}

export default function GameResult({ isWinner }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const history = useHistory();
  const theme = isWinner ? 'game-result-victory' : 'game-result-defeat';

  if (dismissed) return null;

  return (
    <div className={`game-result-overlay ${theme}`}>
      <div className="game-result-content">
        <div className="game-result-divider" />
        <div className="game-result-main-text">
          {isWinner ? 'VICTORY' : 'DEFEAT'}
        </div>
        <div className="game-result-divider" />
        <div className="game-result-sub-text">
          {isWinner ? '勝利しました！' : '敗北しました。'}
        </div>
        <div className="game-result-buttons">
          <button
            className="game-result-btn game-result-btn-secondary"
            onClick={() => setDismissed(true)}
          >
            盤面を確認する
          </button>
          <button
            className="game-result-btn game-result-btn-primary"
            onClick={() => history.push('/games')}
          >
            ゲーム一覧へ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
