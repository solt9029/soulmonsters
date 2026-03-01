import { useContext, type ChangeEvent, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  useStartGameMutation,
  GamesDocument,
  useDecksQuery,
} from '../../graphql/generated/graphql-client';
import { FormGroup, Input, Button, Alert } from 'reactstrap';
import { Col } from '../../styled/reactstrap';
import { AppContext } from '../../contexts/AppContext';
import * as ErrorMessages from '../../constants/error-messages';

const StyledButton = styled(Button)`
  width: 100%;
`;

export default function StartGame() {
  const {
    state: { selectedDeckId, startGameError },
    dispatch,
  } = useContext(AppContext);

  const history = useHistory();

  const [startGame, { loading }] = useStartGameMutation({
    refetchQueries: [{ query: GamesDocument }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      history.push(`/games/${data.startGame.id}`);
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR',
        payload: { name: 'startGameError', error },
      });
    },
  });

  const handleDeckSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const deckId = parseInt(event.target.value);
    dispatch({ type: 'SET_SELECTED_DECK_ID', payload: deckId });
  };

  const handleClick = useCallback(() => {
    if (selectedDeckId !== null) {
      dispatch({ type: 'RESET_ERROR', payload: 'startGameError' });
      startGame({ variables: { deckId: selectedDeckId } });
    }
  }, [selectedDeckId, startGame, dispatch]);

  const decksQueryResult = useDecksQuery();

  return (
    <FormGroup row>
      <Col sm={12}>
        {startGameError !== null &&
          startGameError.message === ErrorMessages.MIN_COUNT && (
            <Alert color="danger">
              デッキのカード枚数が40枚未満のため、ゲームを開始できません
            </Alert>
          )}
        {startGameError !== null &&
          startGameError.message !== ErrorMessages.MIN_COUNT && (
            <Alert color="danger">ゲームの開始中にエラーが発生しました</Alert>
          )}
      </Col>
      <Col sm={12}>
        <Input
          type="select"
          onChange={handleDeckSelectChange}
          value={selectedDeckId || undefined}
        >
          <option value="default">
            ソウルバトルに使用するデッキを選択してください
          </option>
          {decksQueryResult.data?.decks?.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </Input>
      </Col>
      <Col sm={12} marginTop={12}>
        <StyledButton
          style={{ width: '100%' }}
          color="success"
          onClick={handleClick}
          disabled={loading}
        >
          ソウルバトル開始
        </StyledButton>
      </Col>
    </FormGroup>
  );
}
