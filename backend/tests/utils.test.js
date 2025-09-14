import { correlateEvents } from "../utils/correlation.js";

describe("correlation utility", () => {
    test("should return empty array if no events", () => {
        const result = correlateEvents([]);
        expect(result).toEqual([]);
    });

    test("should cluster events correctly", () => {
        const events = [
            { _id: 1, time: new Date("2025-09-01"), ra: 10, dec: 20 },
            { _id: 2, time: new Date("2025-09-01"), ra: 10.5, dec: 20.5 },
            { _id: 3, time: new Date("2025-10-01"), ra: 100, dec: -20 },
        ];

        const clusters = correlateEvents(events, { timeWindow: 2, spatialWindow: 1 });
        expect(clusters.length).toBeGreaterThan(0);
    });
});
