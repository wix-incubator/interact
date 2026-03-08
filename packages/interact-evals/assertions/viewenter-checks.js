/**
 * Semantic checks for viewEnter trigger test cases.
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

  check('has viewEnter trigger', /trigger:\s*['"]viewEnter['"]/.test(output));

  check('does not use IntersectionObserver directly', !/IntersectionObserver/.test(output));

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

  if (expected.has_threshold) {
    check('has threshold', /threshold:\s*[\d.]+/.test(output));
  }

  if (expected.effect_type === 'namedEffect') {
    check('uses namedEffect', /namedEffect\s*:/.test(output));
  } else if (expected.effect_type === 'customEffect') {
    check('uses customEffect', /customEffect\s*:/.test(output));
  }

  if (expected.named_effect) {
    check(
      `uses ${expected.named_effect} preset`,
      new RegExp(expected.named_effect, 'i').test(output),
    );
  }

  if (expected.has_duration) {
    check('has duration', /duration:\s*\d+/.test(output));
  }

  if (expected.staggered) {
    check('has staggered delays', /delay:\s*\d+/.test(output));
    const delays = [...output.matchAll(/delay:\s*(\d+)/g)].map((m) =>
      parseInt(m[1]),
    );
    check(
      'delays increase progressively',
      delays.length >= 2 && delays[delays.length - 1] > delays[0],
    );
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
