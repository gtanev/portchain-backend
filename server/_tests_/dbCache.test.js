import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import dbCache from '../db/dbCache';

describe('dbCache', () => {
  it('should store and retrieve values', () => {
    dbCache.set('ports', ['P1', 'P2', 'P3']);

    const ports = dbCache.get('ports');

    assert.isArray(ports);
    assert.isNotEmpty(ports);
    assert.deepEqual(ports, ['P1', 'P2', 'P3']);
  });

  it('should modify existing values in place', () => {
    dbCache.set('ports', ['P1', 'P2', 'P3']);

    const ports = dbCache.get('ports');

    ports.push('P4');

    expect(dbCache.get('ports')).to.have.length(4);
    expect(dbCache.get('ports')).to.include('P4');
  });
});
