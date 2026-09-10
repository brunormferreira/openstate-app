import { FooterWrapper, FooterInner, Credit, Links, FooterLink } from './Footer.styles';

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