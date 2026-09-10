import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.colors.overlay};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;