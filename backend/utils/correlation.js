import Event from "../models/Event.js";

/**
 * correlateEvents - finds clusters of events
 * @param {Array} events - array of event objects
 * @param {Object} options - optional thresholds
 *    options.timeWindowDays - max time difference in days (default 1)
 *    options.angleThreshold - max angular distance in degrees (default 1)
 */
export const correlateEvents = (events, options = {}) => {
  const timeWindow = options.timeWindowDays || 1; // ±1 day
  const angleThreshold = options.angleThreshold || 1; // ±1 degree

  // Sort events by time ascending
  events.sort((a, b) => new Date(a.time) - new Date(b.time));

  const clusters = [];
  const used = new Set();

  // Helper: angular distance between two points (RA/DEC)
  const angularDistance = (ra1, dec1, ra2, dec2) => {
    const deg2rad = (deg) => (deg * Math.PI) / 180;
    const ra1Rad = deg2rad(ra1);
    const dec1Rad = deg2rad(dec1);
    const ra2Rad = deg2rad(ra2);
    const dec2Rad = deg2rad(dec2);

    const sinDec1 = Math.sin(dec1Rad);
    const sinDec2 = Math.sin(dec2Rad);
    const cosDec1 = Math.cos(dec1Rad);
    const cosDec2 = Math.cos(dec2Rad);
    const deltaRA = ra1Rad - ra2Rad;

    const angle = Math.acos(sinDec1 * sinDec2 + cosDec1 * cosDec2 * Math.cos(deltaRA));
    return (angle * 180) / Math.PI; // in degrees
  };

  for (let i = 0; i < events.length; i++) {
    if (used.has(i)) continue;
    const cluster = [events[i]];
    used.add(i);

    for (let j = i + 1; j < events.length; j++) {
      if (used.has(j)) continue;

      const timeDiff =
        Math.abs(new Date(events[i].time) - new Date(events[j].time)) /
        (1000 * 60 * 60 * 24); // days

      const angDist = angularDistance(
        events[i].ra,
        events[i].dec,
        events[j].ra,
        events[j].dec
      );

      if (timeDiff <= timeWindow && angDist <= angleThreshold) {
        cluster.push(events[j]);
        used.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
};
