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
            keyframes: [
              { transform: 'translateX(0px)' },
              { transform: 'translateX(220px)' },
            ],
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

  const compositeConfig = useMemo<InteractConfig>(() => {
    return {
      interactions: [
        {
          key: 'composite-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self', axis: 'x' },
          effects: [
            {
              key: 'composite-ball',
              effectId: 'scale-x-effect',
            },
          ],
        },
        {
          key: 'composite-container',
          trigger: 'pointerMove',
          params: { hitArea: 'self', axis: 'y' },
          effects: [
            {
              key: 'composite-ball',
              effectId: 'scale-y-effect',
            },
          ],
        },
      ],
      effects: {
        'scale-x-effect': {
          keyframeEffect: {
            name: 'scale-x',
            keyframes: [
              { transform: 'scaleX(0.5)' },
              { transform: 'scaleX(1.5)' },
            ],
          },
          fill: 'both',
          composite: 'accumulate',
        },
        'scale-y-effect': {
          keyframeEffect: {
            name: 'scale-y',
            keyframes: [
              { transform: 'scaleY(0.5)' },
              { transform: 'scaleY(1.5)' },
            ],
          },
          fill: 'both',
          composite: 'accumulate',
        },
      },
    };
  }, []);

  useInteractInstance(config);
  useInteractInstance(compositeConfig);

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
              <div className="pointer-demo-indicator">
                Move {axis === 'x' ? '← →' : '↑ ↓'}
              </div>
            </interact-element>
          </div>
        </interact-element>

        <div className="pointer-demo-info">
          <p>
            <strong>New Feature:</strong> Using <code>keyframeEffect</code> with <code>pointerMove</code> trigger.
            The <code>axis</code> prop maps pointer position to animation progress.
          </p>
        </div>
      </section>

      <section className="panel pointer-demo-section">
        <p className="scroll-label">Composite KeyframeEffect Demo</p>
        <div className="pointer-demo-header">
          <h3>Composite KeyframeEffect (X + Y)</h3>
          <p className="pointer-demo-description">
            Two <code>keyframeEffect</code> animations with <code>composite: 'accumulate'</code>.
            <code>axis: 'x'</code> controls scaleX, <code>axis: 'y'</code> controls scaleY.
          </p>
        </div>

        <interact-element data-interact-key="composite-container">
          <div className="pointer-demo-composite-container">
            <interact-element data-interact-key="composite-ball">
              <div className="pointer-demo-composite-ball" />
            </interact-element>
            <div className="pointer-demo-composite-guide">
              <span className="guide-x">X → scaleX</span>
              <span className="guide-y">Y ↓ scaleY</span>
            </div>
          </div>
        </interact-element>

        <div className="pointer-demo-info">
          <p>
            <strong>Composite Pattern:</strong> Two animations target the same <code>transform</code> property.
            <code>composite: 'accumulate'</code> allows both animations to contribute to <code>transform</code>.
          </p>
        </div>
      </section>
    </>
  );
};

