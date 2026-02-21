import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { Container } from '../styled/reactstrap';
import { useGameQuery } from '../graphql/generated/graphql-client';
import GameCardArea from '../components/game/GameCardArea';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './Game.css';
import GameCardModal from '../components/game/GameCardModal';
import GameCardListModal from '../components/game/GameCardListModal';
import { AppContext } from '../contexts/AppContext';

export default function Game() {
  const { id } = useParams<{ id: string }>();
  const gameId = parseInt(id);

  const {
    state: { user },
  } = useContext(AppContext);

  const { data, loading, error } = useGameQuery({
    variables: { id: gameId },
  });

  if (loading) {
    return <Container marginTop={12}>ゲーム情報をロード中です</Container>;
  }

  if (error) {
    return (
      <Container marginTop={12}>
        ゲーム情報の取得中にエラーが発生しました
      </Container>
    );
  }

  const game = data?.game;
  const isEnded = game?.endedAt !== null && game?.endedAt !== undefined;
  const isWinner = game?.winnerUserId === user.data?.uid;

  return (
    <>
      {isEnded && (
        <Alert color={isWinner ? 'success' : 'danger'} className="mb-0">
          {isWinner ? '勝利しました！' : '敗北しました。'}
        </Alert>
      )}
      <SplitterLayout secondaryInitialSize={20} percentage>
        <GameCardArea gameId={gameId} />
        <div>pane2</div>
      </SplitterLayout>
      <GameCardModal />
      <GameCardListModal />
    </>
  );
}
