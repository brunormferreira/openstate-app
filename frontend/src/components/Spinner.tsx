import styled from 'styled-components';

const Wrap = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`;

export function Spinner() {
  return (
    <Center>
      <Wrap aria-label="Loading" role="status" />
    </Center>
  );
}
