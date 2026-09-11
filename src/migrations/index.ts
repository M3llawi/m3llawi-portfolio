import * as migration_20260911_114613_initial_schema from './20260911_114613_initial_schema';
import * as migration_20260911_124654_bio_richtext from './20260911_124654_bio_richtext';

export const migrations = [
  {
    up: migration_20260911_114613_initial_schema.up,
    down: migration_20260911_114613_initial_schema.down,
    name: '20260911_114613_initial_schema',
  },
  {
    up: migration_20260911_124654_bio_richtext.up,
    down: migration_20260911_124654_bio_richtext.down,
    name: '20260911_124654_bio_richtext'
  },
];
