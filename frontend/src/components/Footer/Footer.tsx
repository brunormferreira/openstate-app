import styled from 'styled-components';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(11,17,32,0.6)' : 'rgba(255,255,255,0.6)')};
  backdrop-filter: blur(10px);
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(4)}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSubtle};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(6)}`};
  }
`;

const Credit = styled.span`
  line-height: 1.6;
`;

const Links = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(4)};
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <Credit>
          Data provided by{' '}
          <FooterLink href="https://openstates.org" target="_blank" rel="noopener noreferrer">
            OpenStates.org
          </FooterLink>{' '}
          &middot; Public domain under US law
        </Credit>
        <Links>
          <FooterLink href="https://docs.openstates.org" target="_blank" rel="noopener noreferrer">
            API Docs
          </FooterLink>
          <FooterLink href="https://github.com/brunormferreira" target="_blank" rel="noopener noreferrer">
            GitHub
          </FooterLink>
        </Links>
      </FooterInner>
    </FooterWrapper>
  );
}