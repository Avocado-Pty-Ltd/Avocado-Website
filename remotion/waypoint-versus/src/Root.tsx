import { Composition } from 'remotion';
import { Versus } from './Versus';
import { Levers } from './Levers';
const VersusM = () => <Versus mobile />;
const LeversM = () => <Levers mobile />;

export const Root = () => (
  <>
    <Composition id="Versus" component={Versus} durationInFrames={330} fps={30} width={1600} height={820} />
    <Composition id="Levers" component={Levers} durationInFrames={330} fps={30} width={1600} height={820} />
    <Composition id="VersusMobile" component={VersusM} durationInFrames={330} fps={30} width={900} height={1300} />
    <Composition id="LeversMobile" component={LeversM} durationInFrames={330} fps={30} width={900} height={1400} />
  </>
);
