/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ComponentType } from 'react';
import styled from 'styled-components';
import { Col as RCol, Container as RContainer, Row as RRow } from 'reactstrap';

function wrapComponent(Component: ComponentType<any>) {
  return ({
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    paddingTop,
    paddingBottom,
    paddingRight,
    paddingLeft,
    ...props
  }: any) => <Component {...props}></Component>;
}

function styleComponent(Component: ComponentType<any>) {
  return styled(wrapComponent(Component))`
    ${({ marginTop }) => (marginTop ? `margin-top: ${marginTop}px;` : '')}
    ${({ marginBottom }) =>
      marginBottom ? `margin-bottom: ${marginBottom}px;` : ''}
    ${({ marginLeft }) => (marginLeft ? `margin-left: ${marginLeft}px;` : '')}
    ${({ marginRight }) =>
      marginRight ? `margin-right: ${marginRight}px;` : ''}
    ${({ paddingTop }) => (paddingTop ? `padding-top: ${paddingTop}px;` : '')}
    ${({ paddingBottom }) =>
      paddingBottom ? `padding-bottom: ${paddingBottom}px;` : ''}
    ${({ paddingLeft }) =>
      paddingLeft ? `padding-left: ${paddingLeft}px;` : ''}
    ${({ paddingRight }) =>
      paddingRight ? `padding-right: ${paddingRight}px;` : ''}
  `;
}

export const Col = styleComponent(RCol);
export const Container = styleComponent(RContainer);
export const Row = styleComponent(RRow);
