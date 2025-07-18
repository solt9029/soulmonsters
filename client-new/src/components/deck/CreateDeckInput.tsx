import { useState, type ChangeEvent, useContext, useCallback } from 'react';
import { Col, FormGroup, Input, Button } from 'reactstrap';
import {
  useCreateDeckMutation,
  DecksDocument,
} from '../../graphql/generated/graphql-client';
import { AppContext } from '../../contexts/AppContext';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 100%;
`;

export default function CreateDeckInput() {
  const { dispatch } = useContext(AppContext);

  const [createDeck] = useCreateDeckMutation({
    refetchQueries: [{ query: DecksDocument }],
    onCompleted: () => {
      dispatch({ type: 'RESET_ERROR', payload: 'createDeckError' });
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR',
        payload: { name: 'createDeckError', error },
      });
    },
  });

  const [name, setName] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleClick = useCallback(() => {
    createDeck({ variables: { name } });
    setName('');
  }, [createDeck, name]);

  return (
    <FormGroup row>
      <Col sm={8}>
        <Input
          type="text"
          id="deck"
          placeholder="デッキ名"
          value={name}
          onChange={handleChange}
        />
      </Col>
      <Col sm={4}>
        <StyledButton
          style={{ width: '100%' }}
          color="success"
          onClick={handleClick}
        >
          作成
        </StyledButton>
      </Col>
    </FormGroup>
  );
}
