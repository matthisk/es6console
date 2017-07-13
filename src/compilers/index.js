import Babel from './babel6';
import Babel5 from './babel5';
import Traceur from './traceur';
import TypeScript from './typescript';
import Regenerator from './regenerator';
import Prepack from './prepack';


export const DEFAULT_COMPILER = 'Babel (6)';

export function getCompiler(name) {
  if (!compilers.hasOwnProperty(name)) {
    throw new ReferenceError(`Unexpected compiler naem ${name} please pick one of ${Object.keys(compilers)}`);
  }

  return compilers[name];
}

const compilers = {
  'Babel (6)': new Babel(),
  'Babel (5)': new Babel5(),
  'Traceur': new Traceur(),
  'TypeScript': new TypeScript(),
  'Regenerator': new Regenerator(),
  'Prepack': new Prepack(),
};

export default compilers;
