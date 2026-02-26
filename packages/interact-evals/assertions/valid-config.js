/**
 * Structural validation: checks that the LLM output looks like a valid InteractConfig.
 * Runs on every test case regardless of trigger type.
 */
module.exports = (output, { vars }) => {
  const reasons = [];
  let score = 1.0;
  const penalty = 0.25;

  const has = (str) => output.includes(str);

  if (!has('trigger:')) {
    reasons.push("Missing 'trigger' field");
    score -= penalty;
  }

  const expectedTrigger = vars.expected_trigger;
  if (expectedTrigger) {
    const triggerRegex = new RegExp(`trigger:\\s*['"]${expectedTrigger}['"]`);
    if (!triggerRegex.test(output)) {
      reasons.push(`Wrong or missing trigger value (expected '${expectedTrigger}')`);
      score -= penalty;
    }
  }

  if (!has('key:')) {
    reasons.push("Missing interaction 'key' field");
    score -= penalty;
  }

  if (!has('effects:') && !has('effects :')) {
    reasons.push("Missing 'effects' array");
    score -= penalty;
  }

  const effectTypes = [
    'namedEffect',
    'keyframeEffect',
    'transition:',
    'transitionProperties',
    'customEffect',
    'effectId',
  ];
  if (!effectTypes.some((t) => has(t))) {
    reasons.push('No valid effect type found');
    score -= penalty;
  }

  const expected = vars.expected || {};
  if (expected.effect_type) {
    const etMap = {
      namedEffect: /namedEffect\s*:/,
      keyframeEffect: /keyframeEffect\s*:/,
      transition: /transition\s*:|transitionProperties\s*:/,
      customEffect: /customEffect\s*:/,
    };
    const regex = etMap[expected.effect_type];
    if (regex && !regex.test(output)) {
      reasons.push(`Expected effect type '${expected.effect_type}' not found`);
      score -= penalty;
    }
  }

  if (!has('interactions') && !has('trigger:')) {
    reasons.push("Missing 'interactions' array or inline interaction");
    score -= penalty;
  }

  score = Math.max(0, Math.min(1, score));
  return {
    pass: score >= 0.75,
    score,
    reason: reasons.length ? reasons.join('; ') : 'Valid config structure',
  };
};
