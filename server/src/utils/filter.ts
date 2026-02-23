export function filter<T>(
  items: T[],
  predicate: (item: T) => boolean,
): T[] {
  const result: T[] = [];
  for (const item of items) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}
