import { ComponentType, CSSProperties } from 'react';

export interface FaultyTerminalProps {
  scale?: number;
  gridMul?: [number, number];
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
  lightMode?: boolean;
  className?: string;
  style?: CSSProperties;
}

const FaultyTerminal: ComponentType<FaultyTerminalProps>;
export default FaultyTerminal;
