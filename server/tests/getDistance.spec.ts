import { getDistance } from "../src/utils/getDistance";

describe('getDistance', () => {
  it('returns 0 for identical points', () => {
    const p = { lng: 2.3522, lat: 48.8566 };
    expect(getDistance(p, p)).toBeCloseTo(0);
  });

  it('calculates an approximate distance between Paris and London', () => {
    const paris = { lng: 2.3522, lat: 48.8566 };
    const london = { lng: -0.1278, lat: 51.5074 };
    const dist = getDistance(paris, london);
    expect(dist).toBeCloseTo(344, 0);
  });
});