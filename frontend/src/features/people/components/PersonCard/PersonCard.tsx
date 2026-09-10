import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import type { Person } from '@/api/types';
import { partyColor } from '@/styles/theme';

const Card = styled.article<{ $accent: string }>`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: ${({ theme }) =>
    `transform ${theme.transition}, box-shadow ${theme.transition}, border-color ${theme.transition}`};

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: ${({ $accent }) => $accent};
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    border-color: ${({ $accent }) => $accent};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

const Photo = styled.div`
  height: 150px;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.photoFrom}, ${theme.colors.photoTo})`};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 480px) {
    height: 170px;
  }

  @media (min-width: 768px) {
    height: 190px;
  }
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: ${({ theme }) => `transform ${theme.transition}`};

  ${Card}:hover & {
    transform: scale(1.04);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${Card}:hover & {
      transform: none;
    }
  }
`;

const Initials = styled.span<{ $accent: string }>`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ $accent }) => $accent};
  color: ${({ $accent }) => $accent};
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.space(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  flex: 1;
`;

const Name = styled.h3`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: 768px) {
    font-size: 17px;
  }
`;

const Role = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const District = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space(2)};
`;

const Tag = styled.span`
  font-size: 11px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 3px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const PartyTag = styled(Tag)<{ $accent: string }>`
  background: ${({ $accent }) => $accent};
  border-color: ${({ $accent }) => $accent};
  color: ${({ theme }) => (theme.mode === 'dark' ? theme.colors.bg : '#ffffff')};
`;

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function PersonCard({ person }: { readonly person: Person }) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const accent = partyColor(theme, person.party);
  const image = imageFailed ? null : person.image;

  return (
    <Card $accent={accent}>
      <Photo>
        {image ? (
          <PhotoImg
            src={image}
            alt={person.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Initials $accent={accent} aria-hidden="true">
            {initials(person.name) || '?'}
          </Initials>
        )}
      </Photo>
      <Body>
        <Name>{person.name}</Name>
        <Role>{person.roleTitle}</Role>
        {person.district && <District>District {person.district}</District>}
        <Tags>
          {person.state && <Tag>{person.state}</Tag>}
          {person.party && (
            <PartyTag $accent={accent} title={person.party}>
              {person.party}
            </PartyTag>
          )}
        </Tags>
      </Body>
    </Card>
  );
}
