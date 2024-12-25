import Elysia from "elysia";
import { test1Handler, test2Handler, testBoxBtcHandler } from "./test";

const testRouter = new Elysia();

testRouter.post("/test1", test1Handler);
testRouter.get("/test2", test2Handler);
testRouter.get("/test_boxBtc", testBoxBtcHandler);

export default testRouter;
