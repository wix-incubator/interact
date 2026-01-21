import { useMemo, useState, useEffect, useCallback } from 'react';
import type { InteractConfig, TriggerType } from '@wix/interact/web';
import { Interact } from '@wix/interact/web';
import { registerEffects } from '@wix/motion';
import * as motionPresets from '@wix/motion-presets';

// Register all motion presets
registerEffects(motionPresets);
console.log('[Presets] Motion presets registered:', Object.keys(motionPresets));

// Hook to manage Interact instance lifecycle
function useInteractInstance(config: InteractConfig) {
  useEffect(() => {
    console.log('[Presets] Creating Interact instance with config:', JSON.stringify(config, null, 2));
    const instance = Interact.create(config);
    return () => {
      console.log('[Presets] Destroying Interact instance');
      instance.destroy();
    };
  }, [config]);
}

type EffectCategory = 'entrance' | 'ongoing' | 'scroll';
type Variant = 'a' | 'b';

type ControlConfig = {
  name: string;
  label: string;
  type: 'select' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  default: string | number;
  unit?: string;
  isNew?: boolean;
};

type EffectConfig = {
  name: string;
  category: EffectCategory;
  controls: ControlConfig[];
};

// Common control templates
const POWER_CONTROL: ControlConfig = {
  name: 'power',
  label: 'Power',
  type: 'select',
  options: [
    { value: '', label: 'Default' },
    { value: 'soft', label: 'Soft' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ],
  default: '',
};

const DURATION_CONTROL: ControlConfig = {
  name: 'duration',
  label: 'Duration',
  type: 'range',
  min: 200,
  max: 3000,
  step: 100,
  default: 1000,
  unit: 'ms',
};

const DELAY_CONTROL: ControlConfig = {
  name: 'delay',
  label: 'Delay',
  type: 'range',
  min: 0,
  max: 1000,
  step: 50,
  default: 0,
  unit: 'ms',
};

const FOUR_DIRECTIONS_CONTROL: ControlConfig = {
  name: 'direction',
  label: 'Direction',
  type: 'select',
  options: [
    { value: 'top', label: 'Top' },
    { value: 'right', label: 'Right' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
  ],
  default: 'right',
};

const RANGE_CONTROL: ControlConfig = {
  name: 'range',
  label: 'Range',
  type: 'select',
  options: [
    { value: 'in', label: 'In' },
    { value: 'out', label: 'Out' },
    { value: 'continuous', label: 'Continuous' },
  ],
  default: 'continuous',
};

// Effect configurations - only effects with new parameters beyond just 'power'
const EFFECT_CONFIGS: Record<string, EffectConfig> = {
  // Entrance effects
  ArcIn: {
    name: 'ArcIn',
    category: 'entrance',
    controls: [
      { ...FOUR_DIRECTIONS_CONTROL },
      { ...POWER_CONTROL },
      { name: 'angle', label: 'Angle', type: 'range', min: 20, max: 120, step: 5, default: 80, unit: '°', isNew: true },
      { name: 'depth', label: 'Depth', type: 'range', min: 50, max: 500, step: 25, default: 300, unit: 'px', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  BounceIn: {
    name: 'BounceIn',
    category: 'entrance',
    controls: [
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'top', label: 'Top' },
          { value: 'right', label: 'Right' },
          { value: 'bottom', label: 'Bottom' },
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
        ],
        default: 'bottom',
      },
      { ...POWER_CONTROL },
      { name: 'distanceFactor', label: 'Distance Factor', type: 'range', min: 0.5, max: 5, step: 0.5, default: 1, unit: 'x', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  GrowIn: {
    name: 'GrowIn',
    category: 'entrance',
    controls: [
      { name: 'direction', label: 'Angle', type: 'range', min: 0, max: 360, step: 15, default: 0, unit: '°' },
      { ...POWER_CONTROL },
      { name: 'initialScale', label: 'Initial Scale', type: 'range', min: 0, max: 1, step: 0.1, default: 0, unit: 'x', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  TiltIn: {
    name: 'TiltIn',
    category: 'entrance',
    controls: [
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
        default: 'left',
      },
      { name: 'depth', label: 'Depth', type: 'range', min: 50, max: 500, step: 25, default: 200, unit: 'px', isNew: true },
      { name: 'tiltAngle', label: 'Tilt Angle', type: 'range', min: 30, max: 180, step: 10, default: 90, unit: '°', isNew: true },
      { name: 'rotateZ', label: 'Rotate Z', type: 'range', min: 0, max: 90, step: 5, default: 30, unit: '°', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  FloatIn: {
    name: 'FloatIn',
    category: 'entrance',
    controls: [
      { ...FOUR_DIRECTIONS_CONTROL, default: 'left' },
      { name: 'distance', label: 'Distance', type: 'range', min: 20, max: 300, step: 10, default: 120, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  FoldIn: {
    name: 'FoldIn',
    category: 'entrance',
    controls: [
      { ...FOUR_DIRECTIONS_CONTROL, default: 'top' },
      { ...POWER_CONTROL },
      { name: 'initialRotate', label: 'Initial Rotate', type: 'range', min: 30, max: 180, step: 10, default: 90, unit: '°', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  FlipIn: {
    name: 'FlipIn',
    category: 'entrance',
    controls: [
      { ...FOUR_DIRECTIONS_CONTROL, default: 'top' },
      { ...POWER_CONTROL },
      { name: 'initialRotate', label: 'Initial Rotate', type: 'range', min: 30, max: 360, step: 15, default: 90, unit: '°', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  TurnIn: {
    name: 'TurnIn',
    category: 'entrance',
    controls: [
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' },
        ],
        default: 'top-left',
      },
      { ...POWER_CONTROL },
      { name: 'angle', label: 'Angle', type: 'range', min: 10, max: 180, step: 10, default: 50, unit: '°', isNew: true },
      { ...DURATION_CONTROL },
      { ...DELAY_CONTROL },
    ],
  },
  // Scroll effects
  FadeScroll: {
    name: 'FadeScroll',
    category: 'scroll',
    controls: [
      { ...RANGE_CONTROL },
      { name: 'opacity', label: 'Target Opacity', type: 'range', min: 0, max: 1, step: 0.1, default: 0, unit: '', isNew: true },
    ],
  },
  GrowScroll: {
    name: 'GrowScroll',
    category: 'scroll',
    controls: [
      { ...RANGE_CONTROL },
      { ...POWER_CONTROL },
      { name: 'scale', label: 'Scale', type: 'range', min: 0, max: 2, step: 0.1, default: 0, unit: 'x', isNew: true },
    ],
  },
  TiltScroll: {
    name: 'TiltScroll',
    category: 'scroll',
    controls: [
      { ...RANGE_CONTROL },
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'right', label: 'Right' },
          { value: 'left', label: 'Left' },
        ],
        default: 'right',
      },
      { ...POWER_CONTROL },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 100, max: 1000, step: 50, default: 400, unit: 'px', isNew: true },
      { name: 'rotationX', label: 'Rotation X', type: 'range', min: 0, max: 45, step: 5, default: 10, unit: '°', isNew: true },
      { name: 'rotationY', label: 'Rotation Y', type: 'range', min: 0, max: 45, step: 5, default: 25, unit: '°', isNew: true },
      { name: 'rotationZ', label: 'Rotation Z', type: 'range', min: 0, max: 45, step: 5, default: 25, unit: '°', isNew: true },
      { name: 'maxTravelY', label: 'Max Travel Y', type: 'range', min: 0, max: 100, step: 10, default: 40, unit: 'vh', isNew: true },
    ],
  },
  ArcScroll: {
    name: 'ArcScroll',
    category: 'scroll',
    controls: [
      { ...RANGE_CONTROL },
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
        default: 'horizontal',
      },
      { name: 'angle', label: 'Angle', type: 'range', min: 20, max: 120, step: 5, default: 68, unit: '°', isNew: true },
      { name: 'depth', label: 'Depth', type: 'range', min: 100, max: 600, step: 50, default: 300, unit: 'px', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 1500, step: 100, default: 500, unit: 'px', isNew: true },
    ],
  },
  FlipScroll: {
    name: 'FlipScroll',
    category: 'scroll',
    controls: [
      { ...RANGE_CONTROL },
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
        default: 'horizontal',
      },
      { ...POWER_CONTROL },
      { name: 'rotate', label: 'Rotate', type: 'range', min: 60, max: 720, step: 30, default: 240, unit: '°', isNew: true },
      { name: 'perspective', label: 'Perspective', type: 'range', min: 200, max: 2000, step: 100, default: 800, unit: 'px', isNew: true },
    ],
  },
};

function App() {
  const [effectType, setEffectType] = useState('ArcIn');
  const [valuesA, setValuesA] = useState<Record<string, string | number>>({});
  const [valuesB, setValuesB] = useState<Record<string, string | number>>({});
  const [statusA, setStatusA] = useState('Ready');
  const [statusB, setStatusB] = useState('Ready');

  const effectConfig = EFFECT_CONFIGS[effectType];
  const isScrollEffect = effectConfig?.category === 'scroll';

  // Get controls for each variant
  const legacyControls = effectConfig?.controls.filter((c) => !c.isNew) || [];
  const fullControls = effectConfig?.controls || [];

  // Build namedEffect options from control values
  const buildNamedEffect = useCallback((variant: Variant) => {
    const values = variant === 'a' ? valuesA : valuesB;
    const controls = variant === 'a' ? legacyControls : fullControls;
    
    const effect: Record<string, unknown> = { type: effectType };
    
    controls.forEach((ctrl) => {
      const value = values[ctrl.name] ?? ctrl.default;
      if (ctrl.name === 'duration' || ctrl.name === 'delay') return;
      if (ctrl.name === 'power' && value === '') return;
      effect[ctrl.name] = ctrl.type === 'range' ? Number(value) : value;
    });
    
    return effect;
  }, [effectType, valuesA, valuesB, legacyControls, fullControls]);

  // Get duration/delay from control values
  const getDuration = useCallback((variant: Variant) => {
    const values = variant === 'a' ? valuesA : valuesB;
    return Number(values.duration ?? 1000);
  }, [valuesA, valuesB]);

  const getDelay = useCallback((variant: Variant) => {
    const values = variant === 'a' ? valuesA : valuesB;
    return Number(values.delay ?? 0);
  }, [valuesA, valuesB]);

  // Build Interact config
  const interactConfig = useMemo<InteractConfig>(() => {
    const effectA = buildNamedEffect('a');
    const effectB = buildNamedEffect('b');
    const durationA = getDuration('a');
    const durationB = getDuration('b');
    const delayA = getDelay('a');
    const delayB = getDelay('b');

    console.log('[Presets] Building config:', { effectType, isScrollEffect, effectA, effectB });

    if (isScrollEffect) {
      // Scroll effects: trigger is the scroll container, targets are the cards
      return {
        interactions: [
          {
            key: 'scroll-trigger',
            trigger: 'viewProgress' as TriggerType,
            params: { type: 'repeat' as const, threshold: 0 },
            effects: [
              {
                key: 'target-a',
                namedEffect: effectA,
                rangeStart: { name: 'cover', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'cover', offset: { value: 100, type: 'percentage' } },
                easing: 'linear',
              },
              {
                key: 'target-b',
                namedEffect: effectB,
                rangeStart: { name: 'cover', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'cover', offset: { value: 100, type: 'percentage' } },
                easing: 'linear',
              },
            ],
          },
        ],
        effects: {},
      };
    } else {
      // Use inline effects in interactions for better reliability
      return {
        interactions: [
          {
            key: 'play-btn-a',
            trigger: 'click' as TriggerType,
            params: { type: 'repeat' as const },
            effects: [
              {
                key: 'target-a',
                namedEffect: effectA,
                duration: durationA,
                delay: delayA,
                easing: 'ease-out',
              },
            ],
          },
          {
            key: 'play-btn-b',
            trigger: 'click' as TriggerType,
            params: { type: 'repeat' as const },
            effects: [
              {
                key: 'target-b',
                namedEffect: effectB,
                duration: durationB,
                delay: delayB,
                easing: 'ease-out',
              },
            ],
          },
          {
            key: 'play-both',
            trigger: 'click' as TriggerType,
            params: { type: 'repeat' as const },
            effects: [
              {
                key: 'target-a',
                namedEffect: effectA,
                duration: durationA,
                delay: delayA,
                easing: 'ease-out',
              },
              {
                key: 'target-b',
                namedEffect: effectB,
                duration: durationB,
                delay: delayB,
                easing: 'ease-out',
              },
            ],
          },
        ],
        effects: {},
      };
    }
  }, [effectType, isScrollEffect, buildNamedEffect, getDuration, getDelay]);

  // Use Interact instance
  useInteractInstance(interactConfig);

  // Update status text
  useEffect(() => {
    if (isScrollEffect) {
      setStatusA('Scroll to animate');
      setStatusB('Scroll to animate');
    } else {
      setStatusA('Ready');
      setStatusB('Ready');
    }
  }, [isScrollEffect]);

  // Handle control value changes
  const handleControlChange = (variant: Variant, name: string, value: string | number) => {
    if (variant === 'a') {
      setValuesA((prev) => ({ ...prev, [name]: value }));
    } else {
      setValuesB((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Reset B to match A (legacy behavior)
  const resetBToLegacy = () => {
    const newValues: Record<string, string | number> = {};
    legacyControls.forEach((ctrl) => {
      newValues[ctrl.name] = valuesA[ctrl.name] ?? ctrl.default;
    });
    fullControls.forEach((ctrl) => {
      if (ctrl.isNew) {
        newValues[ctrl.name] = ctrl.default;
      }
    });
    setValuesB(newValues);
  };

  // Copy config between variants
  const copyConfig = (from: Variant, to: Variant) => {
    const fromValues = from === 'a' ? valuesA : valuesB;
    const fromControls = from === 'a' ? legacyControls : fullControls;
    const toControls = to === 'a' ? legacyControls : fullControls;
    
    const newValues: Record<string, string | number> = {};
    const toControlNames = new Set(toControls.map((c) => c.name));
    
    fromControls.forEach((ctrl) => {
      if (toControlNames.has(ctrl.name)) {
        newValues[ctrl.name] = fromValues[ctrl.name] ?? ctrl.default;
      }
    });
    
    if (to === 'a') {
      setValuesA((prev) => ({ ...prev, ...newValues }));
    } else {
      setValuesB((prev) => ({ ...prev, ...newValues }));
    }
  };

  // Reset to defaults
  const resetToDefaults = (variant: Variant) => {
    if (variant === 'a') {
      setValuesA({});
    } else {
      setValuesB({});
    }
  };

  // Render a control
  const renderControl = (ctrl: ControlConfig, variant: Variant) => {
    const values = variant === 'a' ? valuesA : valuesB;
    const value = values[ctrl.name] ?? ctrl.default;
    const isNewParam = ctrl.isNew;

    if (ctrl.type === 'select') {
      return (
        <div className={`control-group ${isNewParam ? 'control-group--new' : ''}`} key={ctrl.name}>
          <label>
            {ctrl.label}
            {isNewParam && <span className="new-badge">NEW</span>}
            <span>{String(value) || 'Default'}</span>
          </label>
          <select
            value={String(value)}
            onChange={(e) => handleControlChange(variant, ctrl.name, e.target.value)}
          >
            {ctrl.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className={`control-group ${isNewParam ? 'control-group--new' : ''}`} key={ctrl.name}>
        <label>
          {ctrl.label}
          {isNewParam && <span className="new-badge">NEW</span>}
          <span>{value}{ctrl.unit}</span>
        </label>
        <input
          type="range"
          min={ctrl.min}
          max={ctrl.max}
          step={ctrl.step}
          value={Number(value)}
          onChange={(e) => handleControlChange(variant, ctrl.name, Number(e.target.value))}
        />
      </div>
    );
  };

  const handleEffectChange = (newEffect: string) => {
    setEffectType(newEffect);
    setValuesA({});
    setValuesB({});
  };

  return (
    <div className="container">
      <header>
        <div className="header-left">
          <a href="/" className="back-link">← Back</a>
          <span className="badge">Playground</span>
          <h1>Effect Comparison</h1>
        </div>
        <div className="effect-selector">
          <label htmlFor="effect-type">Effect</label>
          <select
            id="effect-type"
            value={effectType}
            onChange={(e) => handleEffectChange(e.target.value)}
          >
            <optgroup label="Entrance">
              <option value="ArcIn">ArcIn</option>
              <option value="BounceIn">BounceIn</option>
              <option value="GrowIn">GrowIn</option>
              <option value="TiltIn">TiltIn</option>
              <option value="FloatIn">FloatIn</option>
              <option value="FoldIn">FoldIn</option>
              <option value="FlipIn">FlipIn</option>
              <option value="TurnIn">TurnIn</option>
            </optgroup>
            <optgroup label="Scroll">
              <option value="FadeScroll">FadeScroll</option>
              <option value="GrowScroll">GrowScroll</option>
              <option value="TiltScroll">TiltScroll</option>
              <option value="ArcScroll">ArcScroll</option>
              <option value="FlipScroll">FlipScroll</option>
            </optgroup>
          </select>
        </div>
        <div className="global-actions">
          {!isScrollEffect && (
            <interact-element data-interact-key="play-both">
              <button className="btn btn-primary">▶ Play Both</button>
            </interact-element>
          )}
          <button className="btn btn-secondary" onClick={() => { resetToDefaults('a'); resetToDefaults('b'); }}>
            Reset to Defaults
          </button>
        </div>
      </header>

      {isScrollEffect ? (
        <interact-element data-interact-key="scroll-trigger">
          <div className="scroll-mode-wrapper">
            <div className="scroll-spacer-top">↓ Scroll to animate ↓</div>
            <div className="comparison-grid">
              {/* Config A (Legacy) */}
              <div className="config-panel" data-variant="a">
                <div className="config-header">
                  <span className="config-label"><span className="config-dot"></span> Legacy</span>
                  <div className="config-actions">
                    <button className="reset-btn" onClick={() => resetToDefaults('a')}>Reset</button>
                    <button className="copy-btn" onClick={() => copyConfig('a', 'b')}>Copy to B →</button>
                  </div>
                </div>
                <div className="config-body">
                  <div className="controls">
                    {legacyControls.length > 0 ? (
                      legacyControls.map((ctrl) => renderControl(ctrl, 'a'))
                    ) : (
                      <p className="no-controls">No legacy controls</p>
                    )}
                  </div>
                  <div className="preview">
                    <interact-element data-interact-key="target-a">
                      <div className="target">A</div>
                    </interact-element>
                    <div className={`status ${statusA.includes('Scroll') ? 'playing' : ''}`}>{statusA}</div>
                  </div>
                </div>
              </div>

              {/* Config B (Full) */}
              <div className="config-panel" data-variant="b">
                <div className="config-header">
                  <span className="config-label"><span className="config-dot"></span> Full</span>
                  <div className="config-actions">
                    <button className="reset-btn" onClick={resetBToLegacy}>Reset to Legacy</button>
                    <button className="copy-btn" onClick={() => copyConfig('b', 'a')}>← Copy to A</button>
                  </div>
                </div>
                <div className="config-body config-body--flipped">
                  <div className="preview">
                    <interact-element data-interact-key="target-b">
                      <div className="target">B</div>
                    </interact-element>
                    <div className={`status ${statusB.includes('Scroll') ? 'playing' : ''}`}>{statusB}</div>
                  </div>
                  <div className="controls controls--flipped">
                    {fullControls.map((ctrl) => renderControl(ctrl, 'b'))}
                  </div>
                </div>
              </div>
            </div>
            <div className="scroll-spacer-bottom">↑ Scroll back up ↑</div>
          </div>
        </interact-element>
      ) : (
        <div className="comparison-grid">
          {/* Config A (Legacy) */}
          <div className="config-panel" data-variant="a">
            <div className="config-header">
              <span className="config-label"><span className="config-dot"></span> Legacy</span>
              <div className="config-actions">
                <interact-element data-interact-key="play-btn-a">
                  <button className="play-btn">▶ Play</button>
                </interact-element>
                <button className="reset-btn" onClick={() => resetToDefaults('a')}>Reset</button>
                <button className="copy-btn" onClick={() => copyConfig('a', 'b')}>Copy to B →</button>
              </div>
            </div>
            <div className="config-body">
              <div className="controls">
                {legacyControls.length > 0 ? (
                  legacyControls.map((ctrl) => renderControl(ctrl, 'a'))
                ) : (
                  <p className="no-controls">No legacy controls</p>
                )}
              </div>
              <div className="preview">
                <interact-element data-interact-key="target-a">
                  <div className="target">A</div>
                </interact-element>
                <div className="status">{statusA}</div>
              </div>
            </div>
          </div>

          {/* Config B (Full) */}
          <div className="config-panel" data-variant="b">
            <div className="config-header">
              <span className="config-label"><span className="config-dot"></span> Full</span>
              <div className="config-actions">
                <interact-element data-interact-key="play-btn-b">
                  <button className="play-btn">▶ Play</button>
                </interact-element>
                <button className="reset-btn" onClick={resetBToLegacy}>Reset to Legacy</button>
                <button className="copy-btn" onClick={() => copyConfig('b', 'a')}>← Copy to A</button>
              </div>
            </div>
            <div className="config-body config-body--flipped">
              <div className="preview">
                <interact-element data-interact-key="target-b">
                  <div className="target">B</div>
                </interact-element>
                <div className="status">{statusB}</div>
              </div>
              <div className="controls controls--flipped">
                {fullControls.map((ctrl) => renderControl(ctrl, 'b'))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
