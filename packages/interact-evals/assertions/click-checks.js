/**
 * Semantic checks for click trigger test cases.
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

  check('has click trigger', /trigger:\s*['"]click['"]/.test(output));

  if (expected.params_type) {
    check(
      `has params type '${expected.params_type}'`,
      new RegExp(`type:\\s*['"]${expected.params_type}['"]`).test(output),
    );
    check(
      'params block exists',
      /params\s*:\s*\{/.test(output),
    );
  }

  if (expected.params_method) {
    check(
      `has params method '${expected.params_method}'`,
      new RegExp(`method:\\s*['"]${expected.params_method}['"]`).test(output),
    );
  }

  if (expected.effect_type === 'transition') {
    check('uses transition effect', /transition\s*:/.test(output) || /transitionProperties\s*:/.test(output));
    check('does not use namedEffect for transition case', !/namedEffect/.test(output));
  }

  if (expected.effect_type === 'namedEffect') {
    check('uses namedEffect', /namedEffect\s*:/.test(output));
  }

  if (expected.cross_target) {
    const keys = [...output.matchAll(/key:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
    check('source and target keys differ (cross-targeting)', new Set(keys).size >= 2);
  }

  if (expected.has_fill_both) {
    check('has fill: both', /fill:\s*['"]both['"]/.test(output));
  }

  if (expected.has_reversed) {
    check('has reversed: true', /reversed:\s*true/.test(output));
  }

  if (expected.has_duration) {
    check('has duration', /duration:\s*\d+/.test(output));
  }

  if (expected.has_easing) {
    check('has easing', /easing:\s*['"]/.test(output));
  }

  const score = total > 0 ? passed / total : 1;
  return {
    pass: score >= 0.8,
    score,
    reason: checks.length ? checks.join('; ') : `All ${total} checks passed`,
  };
};
