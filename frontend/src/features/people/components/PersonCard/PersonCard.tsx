import { useState } from 'react';
import { useTheme } from 'styled-components';
import type { Person } from '@/api/types';
import { partyColor } from '@/styles/theme';
import { Card, Photo, PhotoImg, Initials, Body, Name, Role, District, Tags, Tag, PartyTag } from './PersonCard.styles';

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