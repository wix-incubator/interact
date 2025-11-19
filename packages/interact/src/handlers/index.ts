import type { TriggerHandlerMap, TriggerType } from '../types';
import viewEnterHandler from './viewEnter';
import viewProgressHandler from './viewProgress';
import hoverHandler from './hover';
import clickHandler from './click';
import pointerMoveHandler from './pointerMove';
import animationEndHandler from './animationEnd';

export default {
  viewEnter: viewEnterHandler,
  hover: hoverHandler,
  click: clickHandler,
  pageVisible: viewEnterHandler,
  animationEnd: animationEndHandler,
  viewProgress: viewProgressHandler,
  pointerMove: pointerMoveHandler,
} as TriggerHandlerMap<TriggerType>;
