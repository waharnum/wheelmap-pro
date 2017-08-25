import { GlobalStats } from '../global-stats.js';
import { publishPublicFields } from '/imports/server/publish';

publishPublicFields('globalStats', GlobalStats);
