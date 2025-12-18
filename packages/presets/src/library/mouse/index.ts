import { create as CreateCustomMouse } from './CustomMouse';
import AiryMouse from './AiryMouse';
import BlobMouse from './BlobMouse';
import BlurMouse from './BlurMouse';
import BounceMouse from './BounceMouse';
import ScaleMouse from './ScaleMouse';
import SkewMouse from './SkewMouse';
import SpinMouse from './SpinMouse';
import SwivelMouse from './SwivelMouse';
import Tilt3DMouse from './Tilt3DMouse';
import Track3DMouse from './Track3DMouse';
import TrackMouse from './TrackMouse';
import type { MouseAnimations } from '../../types';

export const mouseAnimations: MouseAnimations = {
  AiryMouse,
  BlobMouse,
  BlurMouse,
  BounceMouse,
  CustomMouse: CreateCustomMouse,
  ScaleMouse,
  SkewMouse,
  SpinMouse,
  SwivelMouse,
  Tilt3DMouse,
  Track3DMouse,
  TrackMouse,
};
