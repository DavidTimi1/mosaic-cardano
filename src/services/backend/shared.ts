import neo4j, { type Driver, type ManagedTransaction, type Session } from 'neo4j-driver';

import { driver } from '@/lib/backend/neo4j';

type Params = Record<string, unknown>;

const normalizeNeo4jValue = (value: unknown): unknown => {
  if (neo4j.isInt(value)) {
    return value.inSafeRange() ? value.toNumber() : value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeNeo4jValue);
  }

  if (value && typeof value === 'object') {
    const maybeNode = value as { properties?: Record<string, unknown> };
    if (maybeNode.properties && typeof maybeNode.properties === 'object') {
      return normalizeNeo4jValue(maybeNode.properties);
    }

    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      output[key] = normalizeNeo4jValue(nested);
    }
    return output;
  }

  return value;
};

const getDriver = (): Driver => driver;

export const withReadSession = async <T>(
  callback: (tx: ManagedTransaction) => Promise<T>,
): Promise<T> => {
  const session: Session = getDriver().session({ defaultAccessMode: neo4j.session.READ });
  try {
    return await session.executeRead(callback);
  } finally {
    await session.close();
  }
};

export const withWriteSession = async <T>(
  callback: (tx: ManagedTransaction) => Promise<T>,
): Promise<T> => {
  const session: Session = getDriver().session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    return await session.executeWrite(callback);
  } finally {
    await session.close();
  }
};

export const runRead = async <T>(
  query: string,
  params: Params,
  mapRow: (row: Record<string, unknown>) => T,
): Promise<T[]> => {
  return withReadSession(async tx => {
    const result = await tx.run(query, params);
    return result.records.map(record => {
      const row = normalizeNeo4jValue(record.toObject()) as Record<string, unknown>;
      return mapRow(row);
    });
  });
};

export const runWrite = async <T>(
  query: string,
  params: Params,
  mapRow: (row: Record<string, unknown>) => T,
): Promise<T[]> => {
  return withWriteSession(async tx => {
    const result = await tx.run(query, params);
    return result.records.map(record => {
      const row = normalizeNeo4jValue(record.toObject()) as Record<string, unknown>;
      return mapRow(row);
    });
  });
};
