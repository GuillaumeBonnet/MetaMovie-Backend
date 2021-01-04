import request from "supertest";
import { app } from "./app";

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/users")
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
