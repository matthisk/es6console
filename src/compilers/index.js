import Babel from './babel6'
import Babel5 from './babel5'
import Traceur from './traceur'
import TypeScript from './typescript'
import Regenerator from './regenerator'


export const DEFAULT_COMPILER = 'Babel (6)';

export default {
  'Babel (6)' : new Babel(),
  'Babel (5)' : new Babel5(),
  'Traceur' : new Traceur(),
  'TypeScript' : new TypeScript(),
  'Regenerator' : new Regenerator(),
};
