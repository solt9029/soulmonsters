import { useContext } from 'react';
import { Container, Row, Col } from '../../styled/reactstrap';
import { Alert } from 'reactstrap';
import styled from 'styled-components';
import {
  useGameQuery,
  Zone,
  useActiveGameIdQuery,
} from '../../graphql/generated/graphql-client';
import GameCardStack from './GameCardStack';
import GameUser from './GameUser';
import GameCardList from './GameCardList';
import { AppContext } from '../../contexts/AppContext';
import { GameActionAlert } from './GameActionAlert';

const StyledContainer = styled(Container)`
  color: white;
`;

const StyledCol = styled(Col)`
  color: white;
  align-items: center;
  -webkit-align-items: center;
  display: flex;
  overflow-x: auto;
  ::before,
  ::after {
    content: '';
    margin: auto;
  }
`;

const StyledRow = styled(Row)`
  display: flex;
  height: 100px;
`;

const StyledAlert = styled(Alert)`
  padding: 6px 12px;
`;

export default function GameCardArea() {
  const {
    state: { actionStatus, dispatchGameActionError },
  } = useContext(AppContext);

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const activeGameId = activeGameIdQueryResult.data?.activeGameId || 1;

  const { data, error, loading } = useGameQuery({
    variables: { id: activeGameId },
  });

  if (error) {
    return (
      <StyledContainer marginTop={12}>
        <Alert color="danger">ゲーム情報の取得中にエラーが発生しました</Alert>
      </StyledContainer>
    );
  }

  if (loading) {
    return (
      <StyledContainer marginTop={12}>
        <Col lg={12}>ゲーム情報をロード中です</Col>
      </StyledContainer>
    );
  }

  const gameCards = data?.game.gameCards;
  const gameUsers = data?.game.gameUsers;

  return (
    <Container marginTop={20} marginBottom={20}>
      {actionStatus.isStarted() && !actionStatus.isCompleted() && (
        <Row>
          <GameActionAlert />
        </Row>
      )}
      {dispatchGameActionError !== null && (
        <Row>
          <Col xs={12}>
            <StyledAlert color="danger">
              {dispatchGameActionError.message}
            </StyledAlert>
          </Col>
        </Row>
      )}

      <Row>
        <GameUser gameUsers={gameUsers} isYours={false} />
      </Row>
      <StyledRow marginTop={5}>
        <StyledCol lg={12}>
          <GameCardList
            gameCards={gameCards}
            isYours={false}
            zone={Zone.Hand}
          />
        </StyledCol>
      </StyledRow>
      <StyledRow marginTop={5}>
        <StyledCol lg={2} xs={2}>
          <GameCardStack
            gameCards={gameCards}
            isYours={false}
            zone={Zone.Deck}
          />
        </StyledCol>
        <StyledCol lg={10} xs={10}>
          <GameCardList
            gameCards={gameCards}
            isYours={false}
            zone={Zone.Soul}
          />
        </StyledCol>
      </StyledRow>
      <StyledRow marginTop={5}>
        <StyledCol lg={2} xs={2}>
          <GameCardStack
            gameCards={gameCards}
            isYours={false}
            zone={Zone.Morgue}
          />
        </StyledCol>
        <StyledCol lg={10} xs={10}>
          <GameCardList
            gameCards={gameCards}
            isYours={false}
            zone={Zone.Battle}
          />
        </StyledCol>
      </StyledRow>

      <StyledRow marginTop={50}>
        {/** your battle zone */}
        <StyledCol lg={10} xs={10}>
          <GameCardList
            gameCards={gameCards}
            isYours={true}
            zone={Zone.Battle}
          />
        </StyledCol>

        {/** your morgue zone */}
        <StyledCol lg={2} xs={2}>
          <GameCardStack
            gameCards={gameCards}
            isYours={true}
            zone={Zone.Morgue}
          />
        </StyledCol>
      </StyledRow>

      <StyledRow marginTop={5}>
        {/** your soul zone */}
        <StyledCol lg={10} xs={10}>
          <GameCardList gameCards={gameCards} isYours={true} zone={Zone.Soul} />
        </StyledCol>

        {/** your deck zone */}
        <StyledCol lg={2} xs={2}>
          <GameCardStack
            gameCards={gameCards}
            isYours={true}
            zone={Zone.Deck}
          />
        </StyledCol>
      </StyledRow>

      <StyledRow marginTop={5}>
        {/** your hand zone */}
        <StyledCol lg={12}>
          <GameCardList gameCards={gameCards} isYours={true} zone={Zone.Hand} />
        </StyledCol>
      </StyledRow>

      <Row marginTop={5}>
        <GameUser gameUsers={gameUsers} isYours={true} />
      </Row>
    </Container>
  );
}
