import styled from 'styled-components';

interface Props {
  isActive?: boolean;
  isRight?: boolean;
}

export default styled.div<Props>`
  height: 100vh;
  width: 100%;
  background-size: cover;
  background-color: ${(props) => (props.isActive ? '#444' : '#222')};
  border: solid 5px #ccc;
  ${(props) => (!props.isRight ? 'border-right-width : 0px;' : '')}
  border-collapse: collapse;
  overflow: auto;
`;
