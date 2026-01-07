import { useMemo, useState } from 'react';
import type { InteractConfig, PointerMoveAxis } from '@wix/interact/react';
import { Interaction } from '@wix/interact/react';
import { useInteractInstance } from '../hooks/useInteractInstance';

type AxisOption = PointerMoveAxis | 'none';

export const PointerMoveDemo = () => {
  const [axis, setAxis] = useState<AxisOption>('horizontal');

  const config = useMemo<InteractConfig>(() => {
    return {
      interactions: [
        {
          key: 'pointer-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self' },
          effects: [
            {
              key: 'pointer-slider',
              effectId: 'slide-effect',
            },
            {
              key: 'pointer-indicator',
              effectId: 'indicator-effect',
            },
          ],
        },
      ],
      effects: {
        'slide-effect': {
          keyframeEffect: {
            name: 'slide-x',
            keyframes: [
              { transform: 'translateX(0px)' },
              { transform: 'translateX(280px)' },
            ],
          },
          axis: axis === 'none' ? undefined : axis,
          fill: 'both',
        },
        'indicator-effect': {
          keyframeEffect: {
            name: 'fade-scale',
            keyframes: [
              { opacity: 0.3, transform: 'scale(0.8)' },
              { opacity: 1, transform: 'scale(1.2)' },
            ],
          },
          axis: axis === 'none' ? undefined : axis,
          fill: 'both',
        },
      },
    };
  }, [axis]);

  useInteractInstance(config);

  return (
    <section className="panel pointer-demo-section">
      <p className="scroll-label">Pointer Move Keyframe Effect Demo</p>
      <div className="pointer-demo-header">
        <h3>Pointer-Driven KeyframeEffect</h3>
        <p className="pointer-demo-description">
          Move your mouse over the container to control the animation with pointer position.
          <br />
          <strong>Axis:</strong> Maps <code>{axis === 'horizontal' ? 'x' : 'y'}</code> position to animation progress.
        </p>
        <div className="pointer-demo-controls">
          <label htmlFor="axis-select">Axis:</label>
          <select
            id="axis-select"
            value={axis}
            onChange={(e) => setAxis(e.target.value as AxisOption)}
            className="pointer-demo-select"
          >
            <option value="horizontal">horizontal (x)</option>
            <option value="vertical">vertical (y)</option>
            <option value="none">none (default: vertical)</option>
          </select>
        </div>
      </div>

      <Interaction
        tagName="div"
        interactKey="pointer-container"
        className="pointer-demo-container"
      >
        <Interaction
          tagName="div"
          interactKey="pointer-slider"
          className="pointer-demo-slider"
        />
        <Interaction
          tagName="div"
          interactKey="pointer-indicator"
          className="pointer-demo-indicator"
        >
          Move {axis === 'horizontal' ? '← →' : axis === 'vertical' ? '↑ ↓' : '↑ ↓ (default)'}
        </Interaction>
      </Interaction>

      <div className="pointer-demo-info">
        <p>
          <strong>New Feature:</strong> Using <code>keyframeEffect</code> with <code>pointerMove</code> trigger.
          The <code>axis</code> prop maps pointer position to animation progress.
        </p>
      </div>
    </section>
  );
};

