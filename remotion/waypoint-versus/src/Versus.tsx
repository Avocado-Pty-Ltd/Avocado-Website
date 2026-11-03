import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadSerif } from '@remotion/google-fonts/SourceSerif4';
import { loadFont as loadSans } from '@remotion/google-fonts/SourceSans3';

const serif = loadSerif('normal', { weights: ['400', '600'] }).fontFamily;
const sans = loadSans('normal', { weights: ['400', '600'] }).fontFamily;

const INK = '#2B1740', MUTED = '#6B5F7C', STAR = '#E3C57E';
const LIGHT = ['#5C8A2E', '#2B1740', '#1F7A80', '#B5487A', '#C8662D'];
const DARK = ['#8BBF4E', '#E3C57E', '#4FB5BB', '#E07FAF', '#F08D4F'];

type Panel = { kind: 'old' | 'new'; eyebrow: string; sub: string; clicks: number; matters: number; rate: string; rateLabel: string; start: number };
const PANELS: Panel[] = [
  { kind: 'old', eyebrow: 'Traditional marketing', sub: 'Judged on clicks', clicks: 12480, matters: 6, rate: '0.05%', rateLabel: 'of clicks became a matter', start: 8 },
  { kind: 'new', eyebrow: 'LEX Waypoint', sub: 'Judged on matters', clicks: 4200, matters: 31, rate: '0.74%', rateLabel: 'of clicks became a matter', start: 16 },
];
const MAX_CLICKS = 12480;
const out = Easing.out(Easing.cubic);
const fmt = (n: number) => Math.round(n).toLocaleString('en-AU');

const PanelView = ({ p, m }: { p: Panel; m?: boolean }) => {
  const W = m ? 836 : 756, H = m ? 590 : 756, PAD = m ? 40 : 48, DOT = m ? 30 : 34, GAP = m ? 10 : 12;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = p.kind === 'new';
  const fg = dark ? '#FFFFFF' : INK;
  const sub = dark ? '#CFC3DE' : MUTED;
  const rule = dark ? 'rgba(255,255,255,.18)' : 'rgba(43,23,64,.16)';
  const pal = dark ? DARK : LIGHT;

  const enter = spring({ frame: frame - p.start, fps, config: { damping: 200 } });
  const cp = interpolate(frame, [p.start + 14, p.start + 100], [0, 1], { easing: out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const clicks = p.clicks * cp;
  const barW = (p.clicks / MAX_CLICKS) * cp;

  const mStart = p.kind === 'old' ? 128 : 134;
  const step = p.kind === 'old' ? 9 : 2.6;
  const dots = Array.from({ length: p.matters }, (_, i) => {
    const s = spring({ frame: frame - (mStart + i * step), fps, config: { damping: 13, stiffness: 160 } });
    return s;
  });
  const shown = dots.filter((s) => s > 0.05).length;
  const rateOp = interpolate(frame, [236, 256], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: W, height: H, boxSizing: 'border-box', padding: PAD, position: 'relative',
      background: dark ? INK : '#FFFFFF', color: fg, border: dark ? 'none' : '1px solid rgba(43,23,64,.16)',
      opacity: enter, transform: `translateY(${(1 - enter) * 18}px)`, fontFamily: sans,
    }}>
      <div style={{ fontSize: 21, letterSpacing: '.12em', textTransform: 'uppercase', color: dark ? STAR : MUTED, fontWeight: 600 }}>{p.eyebrow}</div>
      <div style={{ fontFamily: serif, fontSize: m ? 36 : 40, marginTop: 6 }}>{p.sub}</div>

      <div style={{ marginTop: m ? 26 : 44, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: sub, fontSize: 22 }}>
        <span>Clicks</span>
        <span style={{ fontFamily: serif, fontSize: m ? 52 : 58, color: fg, fontVariantNumeric: 'tabular-nums' }}>{fmt(clicks)}</span>
      </div>
      <div style={{ height: 14, marginTop: 10, background: dark ? 'rgba(255,255,255,.1)' : 'rgba(43,23,64,.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${barW * 100}%`, background: dark ? '#B3A5C6' : '#A79DB4' }} />
      </div>

      <div style={{ marginTop: m ? 30 : 56, borderTop: `1px solid ${rule}`, paddingTop: m ? 20 : 28, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: sub, fontSize: 22 }}>
        <span>Matters opened</span>
        <span style={{ fontFamily: serif, fontSize: m ? 92 : 110, lineHeight: 1, color: fg, fontVariantNumeric: 'tabular-nums' }}>{shown}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: GAP, marginTop: m ? 16 : 22, width: W - PAD * 2 }}>
        {dots.map((s, i) => (
          <div key={i} style={{ width: DOT, height: DOT, borderRadius: DOT / 2, background: pal[i % 5], transform: `scale(${Math.max(0, s)})`, opacity: Math.min(1, s * 2) }} />
        ))}
      </div>

      <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: m ? 30 : 40, opacity: rateOp, transform: `translateY(${(1 - rateOp) * 8}px)`, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: serif, fontSize: 44, color: dark ? STAR : INK }}>{p.rate}</span>
        <span style={{ fontSize: 22, color: sub }}>{p.rateLabel}</span>
      </div>
    </div>
  );
};

export const Versus = ({ mobile }: { mobile?: boolean }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#FFFFFF' }}>
      <AbsoluteFill style={{ padding: 32, display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
        {PANELS.map((p) => <PanelView key={p.kind} p={p} m={mobile} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
