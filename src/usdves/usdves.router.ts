import { Elysia } from "elysia";
import { getUsdVesCurrentHandler } from "./usdves.controller";

const usdVesRouter = new Elysia();

usdVesRouter.get("/get-usd-ves-current", getUsdVesCurrentHandler);

export default usdVesRouter;
