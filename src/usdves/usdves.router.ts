import { Elysia } from "elysia";
import { getUsdVes1Handler } from "./usdves.controller";

const usdVesRouter = new Elysia();

usdVesRouter.get("/get-usd-ves-rate-1", getUsdVes1Handler);

export default usdVesRouter;
