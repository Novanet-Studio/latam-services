import { test1, test2 } from "./test.service";
import Logger from "../logger";

interface Params {
  body?: any;
  set?: any;
}

const logger = new Logger("connection mibanco space");

export async function test1Handler({ set }: Params) {
  try {
    const response = await test1();
    const json = await response.json();

    logger.info(json, "test 1 result -->");

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "test 1");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function test2Handler({ set }: Params) {
  try {
    const response = await test2();
    const json = await response.json();

    logger.info(json, "test 2 result -->");

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "test 1");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}
