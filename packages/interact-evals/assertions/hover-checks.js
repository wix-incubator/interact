/**
 * Semantic checks for hover trigger test cases.
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

  check('has hover trigger', /trigger:\s*['"]hover['"]/.test(output));

  check('does not use CSS :hover pseudo-class', !/:hover\s*\{/.test(output));

  if (expected.effect_type === 'transition') {
    check(
      'uses transition effect',
      /transition\s*:/.test(output) || /transitionProperties\s*:/.test(output),
    );
    check('does not use keyframeEffect for transition case', !/keyframeEffect/.test(output));
  } else if (expected.effect_type === 'keyframeEffect') {
    check('uses keyframeEffect', /keyframeEffect\s*:/.test(output));
  } else if (expected.effect_type === 'namedEffect') {
    check('uses namedEffect', /namedEffect\s*:/.test(output));
  }

  if (expected.has_fill_both) {
    check('has fill: both', /fill:\s*['"]both['"]/.test(output));
  }

  if (expected.has_duration) {
    check('has duration', /duration:\s*\d+/.test(output));
  }

  if (expected.has_transform) {
    check('uses transform', /transform/.test(output));
  }

  if (expected.cross_target) {
    const keys = [...output.matchAll(/key:\s*['"]([^'"]+)['"]/g)].map(
      (m) => m[1],
    );
    check('source and target keys differ', new Set(keys).size >= 2);
  }

  const score = total > 0 ? passed / total : 1;
  return {
    pass: score >= 0.8,
    score,
    reason: checks.length ? checks.join('; ') : `All ${total} checks passed`,
  };
};
