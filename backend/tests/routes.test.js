import request from "supertest";
import app from "../server.js";

describe("Event API", () => {
    it("GET /api/events should return events", async () => {
        const res = await request(app).get("/api/events");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("events");
    });

    it("POST /api/events should create a new event", async () => {
        const newEvent = {
            source: "GWOSC",
            type: "gravitational wave",
            time: new Date(),
            ra: 45,
            dec: -20
        };

        const res = await request(app).post("/api/events").send(newEvent);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("event");
        expect(res.body.event.source).toBe("GWOSC");
    });
});
