import styled from 'styled-components';

export const Box = styled.div`
  max-width: 480px;
  margin: 96px auto;
  padding: ${({ theme }) => theme.space(8)};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.text};
`;

export const Message = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.space(5)};
`;

export const ReloadButton = styled.button`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(5)}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;
