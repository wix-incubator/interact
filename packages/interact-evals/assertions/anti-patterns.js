/**
 * Anti-pattern detection: checks for known mistakes from the rules' "Critical Pitfalls" section.
 * These are things that indicate the LLM misunderstood the library.
 */
module.exports = (output, { vars }) => {
  const reasons = [];
  let score = 1.0;
  const penalty = 0.25;

  const has = (str) => output.includes(str);
  const hasI = (str) => output.toLowerCase().includes(str.toLowerCase());
  const triggerType = vars.expected_trigger || '';

  // Anti-pattern: using vanilla JS event listeners instead of declarative config
  if (/addEventListener\s*\(/.test(output)) {
    reasons.push('Uses addEventListener — should use declarative InteractConfig');
    score -= penalty;
  }

  // Anti-pattern: direct DOM manipulation instead of config
  if (/document\.(querySelector|getElementById|getElementsBy)/.test(output) && !has('customEffect')) {
    reasons.push('Uses direct DOM queries outside customEffect — should use declarative key-based targeting');
    score -= penalty;
  }

  // Anti-pattern: CSS @keyframes or style tags instead of interact config
  if (/@keyframes\s/.test(output) && !has('customEffect')) {
    reasons.push('Uses CSS @keyframes instead of interact keyframeEffect/namedEffect');
    score -= penalty;
  }

  // Anti-pattern: keyframeEffect with pointerMove for 2D effects
  if (triggerType === 'pointerMove' && has('keyframeEffect') && !has('axis:')) {
    reasons.push('Uses keyframeEffect with pointerMove without axis param — should use namedEffect mouse presets or customEffect for 2D');
    score -= penalty;
  }

  // Anti-pattern: viewProgress namedEffect missing range option
  if (triggerType === 'viewProgress' && has('namedEffect') && !has('rangeStart') && !has('rangeEnd')) {
    reasons.push('viewProgress namedEffect missing rangeStart/rangeEnd');
    score -= penalty;
  }

  // Anti-pattern: viewEnter alternate/repeat with same source and target key
  if (triggerType === 'viewEnter') {
    const altOrRepeat = /type:\s*['"](?:alternate|repeat)['"]/i.test(output);
    if (altOrRepeat) {
      const keys = [...output.matchAll(/key:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      if (keys.length > 0 && new Set(keys).size === 1) {
        reasons.push('viewEnter alternate/repeat uses same source and target key — animation may retrigger');
        score -= penalty;
      }
    }
  }

  // Anti-pattern: using width/height/margin in keyframe animations (layout thrashing)
  const layoutProps = ['width:', 'height:', 'margin:', 'padding:'];
  const hasLayoutAnimation = layoutProps.some((p) => {
    return output.includes('keyframes') && output.includes(p);
  });
  if (hasLayoutAnimation) {
    const transformBased = has('transform') || has('opacity') || has('filter');
    if (!transformBased) {
      reasons.push('Animates layout properties without transform/opacity — may cause jank');
      score -= penalty * 0.5;
    }
  }

  // Anti-pattern: overflow: hidden with viewProgress
  if (triggerType === 'viewProgress' && /overflow:\s*['"]?hidden/i.test(output)) {
    reasons.push('Uses overflow:hidden with viewProgress — should use overflow:clip');
    score -= penalty;
  }

  // Anti-pattern: using wrong trigger name (e.g. 'mousemove' instead of 'pointerMove')
  const wrongTriggers = ['mousemove', 'mouseenter', 'mouseleave', 'scroll', 'intersection'];
  for (const wt of wrongTriggers) {
    if (new RegExp(`trigger:\\s*['"]${wt}['"]`, 'i').test(output)) {
      reasons.push(`Uses incorrect trigger name '${wt}' instead of interact trigger`);
      score -= penalty;
    }
  }

  score = Math.max(0, Math.min(1, score));
  return {
    pass: score >= 0.5,
    score,
    reason: reasons.length ? reasons.join('; ') : 'No anti-patterns detected',
  };
};
