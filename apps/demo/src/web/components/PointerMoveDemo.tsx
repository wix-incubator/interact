import { useMemo, useState } from 'react';
import type { InteractConfig, PointerMoveAxis } from '@wix/interact/web';
import { useInteractInstance } from '../hooks/useInteractInstance';

export const PointerMoveDemo = () => {
  const [axis, setAxis] = useState<PointerMoveAxis>('x');

  const config = useMemo<InteractConfig>(() => {
    return {
      interactions: [
        {
          key: 'pointer-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self', axis: axis },
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
            keyframes: [{ transform: 'translateX(0px)' }, { transform: 'translateX(220px)' }],
          },
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
          fill: 'both',
        },
      },
    };
  }, [axis]);

  const compositeAddConfig = useMemo<InteractConfig>(() => {
    return {
      interactions: [
        {
          key: 'composite-add-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self', axis: 'x' },
          effects: [
            {
              key: 'composite-add-ball',
              effectId: 'scale-x-effect',
            },
          ],
        },
        {
          key: 'composite-add-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self', axis: 'y' },
          effects: [
            {
              key: 'composite-add-ball',
              effectId: 'scale-y-effect',
            },
          ],
        },
      ],
      effects: {
        'scale-x-effect': {
          keyframeEffect: {
            name: 'scale-x',
            keyframes: [{ transform: 'scaleX(0.5)' }, { transform: 'scaleX(1.5)' }],
          },
          fill: 'both',
          composite: 'add',
        },
        'scale-y-effect': {
          keyframeEffect: {
            name: 'scale-y',
            keyframes: [{ transform: 'scaleY(0.5)' }, { transform: 'scaleY(1.5)' }],
          },
          fill: 'both',
          composite: 'add',
        },
      },
    };
  }, []);

  useInteractInstance(config);
  useInteractInstance(compositeAddConfig);

  return (
    <>
      <section className="panel pointer-demo-section">
        <p className="scroll-label">Pointer Move Keyframe Effect Demo</p>
        <div className="pointer-demo-header">
          <h3>Pointer-Driven KeyframeEffect</h3>
          <p className="pointer-demo-description">
            Move your mouse over the container to control the animation with pointer position.
            <br />
            <strong>Axis:</strong> Maps <code>{axis}</code> position to animation progress.
          </p>
          <div className="pointer-demo-controls">
            <label htmlFor="axis-select">Axis:</label>
            <select
              id="axis-select"
              value={axis}
              onChange={(e) => setAxis(e.target.value as PointerMoveAxis)}
              className="pointer-demo-select"
            >
              <option value="x">x</option>
              <option value="y">y</option>
            </select>
          </div>
        </div>

        <interact-element data-interact-key="pointer-container">
          <div className="pointer-demo-container">
            <interact-element data-interact-key="pointer-slider">
              <div className="pointer-demo-slider" />
            </interact-element>
            <interact-element data-interact-key="pointer-indicator">
              <div className="pointer-demo-indicator">Move {axis === 'x' ? '← →' : '↑ ↓'}</div>
            </interact-element>
          </div>
        </interact-element>

        <div className="pointer-demo-info">
          <p>
            <strong>New Feature:</strong> Using <code>keyframeEffect</code> with{' '}
            <code>pointerMove</code> trigger. The <code>axis</code> prop maps pointer position to
            animation progress.
          </p>
        </div>
      </section>

      <section className="panel pointer-demo-section">
        <p className="scroll-label">Composite (Scale)</p>
        <div className="pointer-demo-header">
          <h3>composite</h3>
          <p className="pointer-demo-description">
            X controls scaleX, Y controls scaleY—transforms compose in sequence.
          </p>
        </div>

        <interact-element data-interact-key="composite-add-container">
          <div className="pointer-demo-composite-container">
            <interact-element data-interact-key="composite-add-ball">
              <div className="pointer-demo-composite-ball pointer-demo-composite-ball--scale" />
            </interact-element>
            <div className="pointer-demo-composite-guide">
              <span className="guide-x">X → scaleX</span>
              <span className="guide-y">Y ↓ scaleY</span>
            </div>
          </div>
        </interact-element>

        <div className="pointer-demo-info">
          <p>
            <code>add</code> composes transforms: scaleX and scaleY apply independently.
          </p>
        </div>
      </section>
    </>
  );
};
