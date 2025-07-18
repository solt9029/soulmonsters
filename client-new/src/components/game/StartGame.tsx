import { useContext, ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import {
  useStartGameMutation,
  ActiveGameIdDocument,
  useDecksQuery,
} from '../../graphql/generated/graphql-client';
import { FormGroup, Input, Button } from 'reactstrap';
import { Col } from '../../styled/reactstrap';
import { AppContext } from '../App';

const StyledButton = styled(Button)`
  width: 100%;
`;

export default function StartGame() {
  const {
    state: { selectedDeckId },
    dispatch,
  } = useContext(AppContext);

  const [startGame] = useStartGameMutation({
    refetchQueries: [{ query: ActiveGameIdDocument }],
    onError: () => {
      // TODO: handle error
    },
  });

  const handleDeckSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const deckId = parseInt(event.target.value);
    dispatch({ type: 'SET_SELECTED_DECK_ID', payload: deckId });
  };

  const handleClick = useCallback(() => {
    if (selectedDeckId !== null) {
      startGame({ variables: { deckId: selectedDeckId } });
    }
  }, [selectedDeckId, startGame]);

  const decksQueryResult = useDecksQuery();

  return (
    <FormGroup row>
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
        >
          ソウルバトル開始
        </StyledButton>
      </Col>
    </FormGroup>
  );
}
