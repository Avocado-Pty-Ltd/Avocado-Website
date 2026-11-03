import { Composition } from 'remotion';
import { Versus } from './Versus';
import { Levers } from './Levers';

export const Root = () => (
  <>
    <Composition id="Versus" component={Versus} durationInFrames={330} fps={30} width={1600} height={820} />
    <Composition id="Levers" component={Levers} durationInFrames={330} fps={30} width={1600} height={820} />
  </>
);
