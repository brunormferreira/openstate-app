import { PeopleList } from '@/features/people/components/PeopleList/PeopleList';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { Footer } from '@/components/Footer/Footer';
import { Page, Header, HeaderInner, Brand, Title, Main } from './App.styles';

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
