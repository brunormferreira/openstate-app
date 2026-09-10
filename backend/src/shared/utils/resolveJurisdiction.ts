const STATE_NAMES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS',
  missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
  oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY',
};

function toOcdId(stateCode: string): string {
  return `ocd-jurisdiction/country:us/state:${stateCode.toLowerCase()}/government`;
}

export function resolveJurisdiction(input: string): string | null {
  const trimmed = input.trim();

  if (trimmed.startsWith('ocd-jurisdiction/')) {
    return trimmed;
  }

  const upper = trimmed.toUpperCase();
  if (upper.length === 2 && /^[A-Z]{2}$/.test(upper)) {
    return toOcdId(upper);
  }

  const code = STATE_NAMES[trimmed.toLowerCase()];
  if (code) {
    return toOcdId(code);
  }

  return null;
}
