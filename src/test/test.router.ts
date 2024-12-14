import Elysia from "elysia";
import { test1Handler, test2Handler } from "./test";

const testRouter = new Elysia();

testRouter.post("/testBoxBtc", test1Handler);
testRouter.get("/test2", test2Handler);

export default testRouter;
