/**
 * Semantic checks for viewProgress trigger test cases.
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

  check(
    'has viewProgress trigger',
    /trigger:\s*['"]viewProgress['"]/.test(output),
  );

  check('has rangeStart', /rangeStart/.test(output));
  check('has rangeEnd', /rangeEnd/.test(output));

  check('does not use scroll event listener', !/addEventListener\s*\(\s*['"]scroll/.test(output));

  if (expected.range_name) {
    check(
      `uses '${expected.range_name}' range`,
      new RegExp(`name:\\s*['"]${expected.range_name}['"]`).test(output),
    );
  }

  if (expected.effect_type === 'namedEffect') {
    check('uses namedEffect', /namedEffect\s*:/.test(output));
  } else if (expected.effect_type === 'keyframeEffect') {
    check('uses keyframeEffect', /keyframeEffect\s*:/.test(output));
  } else if (expected.effect_type === 'customEffect') {
    check('uses customEffect', /customEffect\s*:/.test(output));
  }

  if (expected.named_effect) {
    check(
      `uses ${expected.named_effect} preset`,
      new RegExp(expected.named_effect, 'i').test(output),
    );
  }

  if (expected.has_easing_linear) {
    check('uses linear easing', /easing:\s*['"]linear['"]/.test(output));
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
