/**
 * Semantic checks for pointerMove trigger test cases.
 */
module.exports = (output, { vars }) => {
  const checks = [];
  let passed = 0;
  let total = 0;

  const check = (name, condition) => {
    total++;
    if (condition) passed++;
    else checks.push(`FAIL: ${name}`);
  };

  const expected = vars.expected || {};

  check('has pointerMove trigger', /trigger:\s*['"]pointerMove['"]/.test(output));

  check('does not use mousemove event listener', !/addEventListener\s*\(\s*['"]mousemove/.test(output));

  if (expected.hit_area) {
    check(
      `has hitArea '${expected.hit_area}'`,
      new RegExp(`hitArea:\\s*['"]${expected.hit_area}['"]`).test(output),
    );
  }

  if (expected.effect_type === 'namedEffect') {
    check('uses namedEffect (correct for pointerMove)', /namedEffect\s*:/.test(output));
    check('does NOT use keyframeEffect for 2D pointer (anti-pattern)', !/keyframeEffect/.test(output));
  } else if (expected.effect_type === 'customEffect') {
    check('uses customEffect', /customEffect\s*:/.test(output));
  } else if (expected.effect_type === 'keyframeEffect') {
    check('uses keyframeEffect', /keyframeEffect\s*:/.test(output));
    check('has axis param for keyframeEffect', /axis:\s*['"]/.test(output));
  }

  if (expected.named_effect) {
    check(
      `uses ${expected.named_effect} preset`,
      new RegExp(expected.named_effect, 'i').test(output),
    );
  }

  if (expected.has_centeredToTarget !== undefined) {
    check(
      `centeredToTarget is ${expected.has_centeredToTarget}`,
      new RegExp(`centeredToTarget:\\s*${expected.has_centeredToTarget}`).test(output),
    );
  }

  if (expected.multi_layer) {
    const effectCount = (output.match(/namedEffect\s*:|customEffect\s*:/g) || []).length;
    check('has multiple effects (multi-layer)', effectCount >= 2);
  }

  const score = total > 0 ? passed / total : 1;
  return {
    pass: score >= 0.8,
    score,
    reason: checks.length ? checks.join('; ') : `All ${total} checks passed`,
  };
};
