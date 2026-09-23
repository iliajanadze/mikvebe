/**
 * Scale ingredient amounts according to serving multiplier
 */
export function scaleIngredientAmount(originalAmount: string, baseServings: number, targetServings: number): string {
  if (!originalAmount || baseServings <= 0 || targetServings <= 0 || baseServings === targetServings) {
    return originalAmount;
  }

  const multiplier = targetServings / baseServings;

  // Match numbers and fractions (e.g., "2 ცალი", "200 გრ", "1.5 ჩ/კ", "1/2 ჭიქა")
  return originalAmount.replace(/(\d+(?:\.\d+)?|\d+\/\d+)/g, (match) => {
    let num = 0;
    if (match.includes('/')) {
      const [n, d] = match.split('/').map(Number);
      num = n / d;
    } else {
      num = parseFloat(match);
    }

    if (isNaN(num)) return match;

    const scaled = num * multiplier;
    // Format nicely
    if (Number.isInteger(scaled)) {
      return scaled.toString();
    }
    // E.g. round to 1 decimal place or nice fraction
    return (Math.round(scaled * 10) / 10).toString();
  });
}
