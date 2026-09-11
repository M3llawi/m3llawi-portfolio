import * as migration_20260911_114613_initial_schema from './20260911_114613_initial_schema';
import * as migration_20260911_124654_bio_richtext from './20260911_124654_bio_richtext';
import * as migration_20260911_144653_media_webp_large_size from './20260911_144653_media_webp_large_size';

export const migrations = [
  {
    up: migration_20260911_114613_initial_schema.up,
    down: migration_20260911_114613_initial_schema.down,
    name: '20260911_114613_initial_schema',
  },
  {
    up: migration_20260911_124654_bio_richtext.up,
    down: migration_20260911_124654_bio_richtext.down,
    name: '20260911_124654_bio_richtext',
  },
  {
    up: migration_20260911_144653_media_webp_large_size.up,
    down: migration_20260911_144653_media_webp_large_size.down,
    name: '20260911_144653_media_webp_large_size'
  },
];
