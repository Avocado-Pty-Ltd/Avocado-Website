import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadSerif } from '@remotion/google-fonts/SourceSerif4';
import { loadFont as loadSans } from '@remotion/google-fonts/SourceSans3';

const serif = loadSerif('normal', { weights: ['400', '600'] }).fontFamily;
const sans = loadSans('normal', { weights: ['400', '600'] }).fontFamily;
const INK = '#2B1740', MUTED = '#6B5F7C', STAR = '#E3C57E', STAR_TEXT = '#8A6A1C';

type Lever = { name: string; tag: string; color: string; from: number; to: number; change: number; order: number; roiDelta: number };
const LEVERS: Lever[] = [
  { name: 'Search and SEO', tag: 'Leadership', color: '#5C8A2E', from: 0.45, to: 0.86, change: 40, order: 1, roiDelta: 3.8 },
  { name: 'Ads', tag: 'Add-on', color: '#C8662D', from: 0.3, to: 0.66, change: 35, order: 2, roiDelta: 2.7 },
  { name: 'Business Profile', tag: 'Growth', color: '#1F7A80', from: 0.5, to: 0.72, change: 20, order: 3, roiDelta: 1.8 },
  { name: 'Directories', tag: 'Growth', color: '#8A8394', from: 0.72, to: 0.2, change: -50, order: 0, roiDelta: 2.8 },
  { name: 'Social', tag: 'Growth', color: '#B5487A', from: 0.4, to: 0.56, change: 15, order: 4, roiDelta: 1.3 },
];
const ROI0 = 9.82;
const START = 22, GAP = 44;
const pullFrame = (l: Lever) => START + l.order * GAP;

const progress = (frame: number, fps: number, l: Lever) =>
  spring({ frame: frame - pullFrame(l), fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });

const roiAt = (frame: number, fps: number) =>
  ROI0 + LEVERS.reduce((a, l) => a + l.roiDelta * Math.min(1.04, Math.max(0, progress(frame, fps, l))), 0);

const TRACK_TOP = 200, TRACK_H = 380;

const LeverView = ({ l, i }: { l: Lever; i: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - i * 3, fps, config: { damping: 200 } });
  const s = progress(frame, fps, l);
  const pos = l.from + (l.to - l.from) * s; // 0..1, 1 = top
  const y = TRACK_TOP + TRACK_H * (1 - pos);
  const active = interpolate(frame, [pullFrame(l) - 4, pullFrame(l) + 6, pullFrame(l) + 40, pullFrame(l) + 62], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const val = Math.round(l.change * Math.max(0, Math.min(1, s)));
  return (
    <div style={{ position: 'absolute', left: i * 172 + 26, width: 172, top: 0, bottom: 0, opacity: enter, transform: `translateY(${(1 - enter) * 14}px)` }}>
      <div style={{ position: 'absolute', top: 104, width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: serif, fontSize: 27, color: INK, lineHeight: 1.15 }}>{l.name}</div>
        <div style={{ fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', color: STAR_TEXT, marginTop: 8, fontWeight: 600 }}>{l.tag}</div>
      </div>
      {/* ticks */}
      {Array.from({ length: 9 }, (_, k) => (
        <div key={k} style={{ position: 'absolute', left: 52, width: k % 4 === 0 ? 22 : 12, height: 1.5, top: TRACK_TOP + (TRACK_H / 8) * k, background: 'rgba(43,23,64,.25)' }} />
      ))}
      {/* track */}
      <div style={{ position: 'absolute', left: 82, width: 8, top: TRACK_TOP, height: TRACK_H, borderRadius: 4, background: 'rgba(43,23,64,.1)' }} />
      <div style={{ position: 'absolute', left: 82, width: 8, top: y, height: TRACK_TOP + TRACK_H - y, borderRadius: 4, background: l.color }} />
      {/* handle */}
      <div style={{ position: 'absolute', left: 86 - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: '#fff', border: `3px solid ${l.color}`, boxShadow: 'none', transform: `scale(${1 + active * 0.14})`, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: l.color }} />
      </div>
      {/* readout */}
      <div style={{ position: 'absolute', top: TRACK_TOP + TRACK_H + 52, width: '100%', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
        <span style={{ fontFamily: serif, fontSize: 44, color: l.change < 0 ? '#A44A12' : INK }}>{l.change < 0 ? '−' : '+'}{Math.abs(val)}%</span>
        <div style={{ fontSize: 16, color: MUTED, marginTop: 2 }}>spend</div>
      </div>
    </div>
  );
};

export const Levers = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [312, 329], [1, 0], { extrapolateLeft: 'clamp' });
  const roi = roiAt(frame, fps);
  const panelIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });

  // chart
  const CX = 0, CW = 508, CH = 300;
  const X = (f: number) => CX + (f / 300) * CW;
  const Y = (v: number) => CH - ((v - 8) / 16) * CH;
  const pts: string[] = [];
  for (let f = 0; f <= Math.min(frame, 300); f += 2) pts.push(`${X(f).toFixed(1)},${Y(roiAt(f, fps)).toFixed(1)}`);
  const last = Math.min(frame, 300);
  const line = pts.length ? 'M' + pts.join(' L') : '';
  const area = pts.length ? line + ` L${X(last).toFixed(1)},${CH} L0,${CH} Z` : '';

  return (
    <AbsoluteFill style={{ background: '#fff', fontFamily: sans, opacity: fade }}>
      <div style={{ position: 'absolute', left: 32, top: 32, width: 936, height: 756, border: '1px solid rgba(43,23,64,.16)', background: '#fff' }}>
        <div style={{ position: 'absolute', left: 48, top: 44, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase', color: MUTED, fontWeight: 600 }}>Marketing levers</div>
        <div style={{ position: 'absolute', left: 48, top: 72, fontFamily: serif, fontSize: 0 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          {LEVERS.map((l, i) => <LeverView key={l.name} l={l} i={i} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 992, top: 32, width: 576, height: 756, background: INK, color: '#fff', opacity: panelIn, transform: `translateY(${(1 - panelIn) * 18}px)` }}>
        <div style={{ position: 'absolute', left: 48, top: 44, fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase', color: STAR, fontWeight: 600 }}>Return on spend</div>
        <div style={{ position: 'absolute', left: 48, top: 96, display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontFamily: serif, fontSize: 132, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.02em' }}>${roi.toFixed(2)}</span>
          <span style={{ fontSize: 24, color: '#CFC3DE' }}>per $1</span>
        </div>
        <svg style={{ position: 'absolute', left: 34, top: 330 }} width={CW + 8} height={CH + 8} viewBox={`-4 -4 ${CW + 8} ${CH + 8}`}>
          {[0, 1, 2, 3].map((k) => <line key={k} x1={0} x2={CW} y1={(CH / 3) * k} y2={(CH / 3) * k} stroke="rgba(255,255,255,.14)" strokeWidth={1} />)}
          <path d={area} fill="rgba(227,197,126,.14)" />
          <path d={line} fill="none" stroke={STAR} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          {pts.length > 0 && <circle cx={X(last)} cy={Y(roi)} r={9} fill={STAR} />}
        </svg>
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 36, fontSize: 18, color: '#B3A5C6', display: 'flex', justifyContent: 'space-between' }}>
          <span>Each lever pulled, measured against matters</span><span>Illustrative</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
