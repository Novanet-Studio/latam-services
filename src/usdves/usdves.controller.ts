import Logger from "../logger";
import { getUsdVes_dolarApi, getUsdVes_fawazahmed0 } from "./usdves.service";

interface Params {
  body: any;
  set: any;
}

const logger = new Logger("usdVesCurrent");

export async function getUsdVesCurrentHandler({ set }: Params) {
  const rateDolarApi = await getDolarApi();

  if (rateDolarApi !== "FAILURE ON dolarApi") {
    return {
      status: "SUCCESS",
      rate: rateDolarApi.promedio,
    };
  }

  const rateFawazahmed0 = await getFawazahmed0();

  if (rateFawazahmed0 !== "FAILURE ON rateFawazahmed0") {
    return {
      status: "SUCCESS",
      rate: 1 / rateFawazahmed0.ves.usd,
    };
  }
  return {
    estado: "error",
    status: "Internal Server Error",
    message: "Error interno de servidor",
  };

  async function getDolarApi() {
    try {
      const res = await getUsdVes_dolarApi();
      const result = await res.json();

      return result;
    } catch (error) {
      set.status = "Internal Server Error";

      logger.info(error, "dolarApi_current_error");

      return "FAILURE ON dolarApi";
    }
  }

  async function getFawazahmed0() {
    try {
      const res = await getUsdVes_fawazahmed0();
      const result = await res.json();

      return result;
    } catch (error) {
      set.status = "Internal Server Error";

      logger.info(error, "fawazahmed0_current_error");

      return "FAILURE ON fawazahmed0";
    }
  }
}
