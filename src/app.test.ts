import request from "supertest";
import { app } from "./app";
import { tmp } from "./routes/tmp";

// jest.mock("./routes/users", () => {
//   return {
//     get: () => {
//       console.log("gboDebug: in mmock");
//     },
//   };
// });
const mock = jest.spyOn(tmp, "get"); // spy on foo
mock.mockImplementation(() => {
  console.log("gboDebug: mocked impl");
});
// const mockedrouterUsers = routerUsers as jest.MockedFunction<
//   typeof routerUsers
// >;
// mockedrouterUsers.mockImplementation(() => {
//   console.log("gboDebug: mocked Impl");
// });
describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/users")
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        expect(mock).toHaveBeenCalledTimes(1);
      });
  });
});
