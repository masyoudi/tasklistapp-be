import type { Pool as PoolClass } from 'pg';
import pg from 'pg';
import { db } from '~~/config';

let pool: PoolClass;

export function useDBPool() {
  if (!pool) {
    pool = new pg.Pool({
      user: db.user,
      password: db.password,
      host: db.host,
      port: db.port,
      database: db.name,
    });
  }

  return pool;
}

export function useSqlPool() {
  const _pool = useDBPool();

  const query = async (text: string, values?: Record<string, any>) => {
    const client = await _pool.connect();
    const { text: _text, values: _values } = parseKeyValueQuery(text, values);
    const res = await client.query(_text, _values);
    client.release(true);

    return res;
  };

  return {
    query,
  };
}

/**
 * Replace text with founded key
 * @param text - string of text
 * @param keys - array of keys
 * @returns string
 */
function replaceKey(text: string, keys: string[]) {
  if (keys.every(k => !text.includes(k))) {
    return text;
  }

  const filteredKeys = keys.filter(k => text.includes(k)).sort((a, b) => b.length - a.length);

  let result = text;
  filteredKeys.forEach((k) => {
    result = result.replace(k, `$${keys.findIndex(key => key === k) + 1}`);
  });

  return result;
}

function parseKeyValueQuery(text: string, values?: Record<string, any>) {
  if (!values) {
    return { text };
  }

  const arrayText = text.replace(/\s{2,}/g, ' ').split(' ');
  const keysInText = Object.keys(values).filter(k => arrayText.findIndex(t => t.includes(k)) >= 0);
  const _text = arrayText.map(txt => replaceKey(txt, keysInText)).join(' ');

  return {
    text: _text,
    values: keysInText.map(key => values[key]),
  };
}
