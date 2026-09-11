import { describe, expect, it, vi } from 'vitest';

const { mockClient } = vi.hoisted(() => ({
  mockClient: { $connect: vi.fn() },
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockClient),
}));

import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/infra/database/prisma.js';

describe('infra/database/prisma', () => {
  it('instantiates the PrismaClient once', () => {
    expect(PrismaClient).toHaveBeenCalledTimes(1);
  });

  it('exports the created client instance', () => {
    expect(prisma).toBe(mockClient);
  });
});