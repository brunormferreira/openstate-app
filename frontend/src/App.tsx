import styled from 'styled-components';
import { PeopleList } from '@/features/people/components/PeopleList/PeopleList';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { Footer } from '@/components/Footer/Footer';


const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: ${({ theme }) => theme.colors.bgAccent};
  background-repeat: no-repeat;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(11,17,32,0.8)' : 'rgba(255,255,255,0.8)')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(6)}`};
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(4)} ${theme.space(6)}`};
  width: 100%;

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.space(8)} ${theme.space(6)} ${theme.space(8)}`};
  }
`;

export default function App() {
  return (
    <Page>
      <Header>
        <HeaderInner>
          <Brand>
            <Title>US Politicians</Title>
          </Brand>
          <ThemeToggle />
        </HeaderInner>
      </Header>
      <Main>
        <PeopleList />
      </Main>
      <Footer />
    </Page>
  );
}
