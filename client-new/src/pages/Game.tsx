import { useActiveGameIdQuery } from '../graphql/generated/graphql-client';
import { Container } from '../styled/reactstrap';
import StartGame from '../components/game/StartGame';
import GameCardArea from '../components/game/GameCardArea';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './Game.css';
import GameCardModal from '../components/game/GameCardModal';
import GameCardListModal from '../components/game/GameCardListModal';

export default function Game() {
  const activeGameIdQueryResult = useActiveGameIdQuery();

  return (
    <>
      {activeGameIdQueryResult.loading && (
        <Container marginTop={12}>ゲーム情報をロード中です</Container>
      )}
      {activeGameIdQueryResult.error && (
        <Container marginTop={12}>
          ゲーム情報の取得中にエラーが発生しました
        </Container>
      )}
      {!activeGameIdQueryResult.error &&
        !activeGameIdQueryResult.data?.activeGameId && (
          <Container marginTop={12}>
            <StartGame />
          </Container>
        )}
      {!activeGameIdQueryResult.error &&
        activeGameIdQueryResult.data?.activeGameId && (
          <SplitterLayout secondaryInitialSize={20} percentage>
            <GameCardArea />
            <div>pane2</div>
          </SplitterLayout>
        )}
      <GameCardModal />
      <GameCardListModal />
    </>
  );
}
