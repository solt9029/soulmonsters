import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Table, Badge } from 'reactstrap';
import { Container, Row, Col } from '../styled/reactstrap';
import {
  useGamesQuery,
  useActiveGameIdQuery,
} from '../graphql/generated/graphql-client';
import StartGame from '../components/game/StartGame';
import { AppContext } from '../contexts/AppContext';

export default function Games() {
  const {
    state: { user },
  } = useContext(AppContext);

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const gamesQueryResult = useGamesQuery();

  const activeGameId = activeGameIdQueryResult.data?.activeGameId;
  const games = gamesQueryResult.data?.games;

  return (
    <Container marginTop={12}>
      {activeGameIdQueryResult.loading || gamesQueryResult.loading ? (
        <Row>
          <Col lg={12}>ゲーム情報をロード中です</Col>
        </Row>
      ) : null}

      {!activeGameId && (
        <Row marginTop={12}>
          <Col lg={12}>
            <StartGame />
          </Col>
        </Row>
      )}

      {activeGameId && (
        <Row marginTop={12}>
          <Col lg={12}>
            <Alert color="info">
              ゲームが進行中です。{' '}
              <Link to={`/games/${activeGameId}`}>ゲームに戻る</Link>
            </Alert>
          </Col>
        </Row>
      )}

      <Row marginTop={24}>
        <Col lg={12}>
          <h5>対戦履歴</h5>
          {games && games.length === 0 && <p>対戦履歴はありません。</p>}
          {games && games.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>日時</th>
                  <th>対戦相手</th>
                  <th>結果</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => {
                  const opponent = game.gameUsers.find(
                    (gu) => gu.userId !== user.data?.uid
                  );
                  const isEnded = game.endedAt !== null;
                  const isWinner = game.winnerUserId === user.data?.uid;
                  return (
                    <tr key={game.id}>
                      <td>
                        {game.startedAt
                          ? new Date(game.startedAt).toLocaleString('ja-JP')
                          : '-'}
                      </td>
                      <td>{opponent?.user.displayName ?? '-'}</td>
                      <td>
                        {isEnded ? (
                          <Badge color={isWinner ? 'success' : 'danger'}>
                            {isWinner ? '勝利' : '敗北'}
                          </Badge>
                        ) : (
                          <Badge color="warning">進行中</Badge>
                        )}
                      </td>
                      <td>
                        <Link to={`/games/${game.id}`}>詳細</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}
