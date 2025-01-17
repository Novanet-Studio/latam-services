import { Stream } from "@elysiajs/stream";
import { payment, requestOTP } from "./miBanco.service";
import Logger from "../logger";

interface Params {
  body?: any;
  set?: any;
  store?: {
    canNotify: boolean;
    data: Record<string, any> | null;
  };
}

const logger = new Logger("miBanco");

export async function requestOTPHandler({ body, set }: Params) {
  try {
    const response = await requestOTP(body);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";
    logger.info(error, "request_otp_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function makePaymentHandler({ body, set }: Params) {
  try {
    const response = await payment(body);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "payment_execution_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function notifyHandler({ store, body, set }: Params) {
  logger.info("<<< START notifyHandler");

  try {
    if (!store) {
      set.status = "Internal Server Error";
      return { message: "Error interno del servidor" };
    }

    store.canNotify = true;

    if (Object.entries(body).length) {
      store.data = body;
    }

    console.log(`<<< body`, JSON.stringify(body));

    logger.info(body, "notification_middleware");

    return { message: "Solicitud recibida" };
  } catch (error) {
    logger.info(error, "notify_controller_error");
    set.status = 500;
    store!.canNotify = false;

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function emitSSEHandler({ store, set }: Params) {
  /*
  store = {
    canNotify: true,
    data: {
      CstmrPmtStsRpt: {
        GrpHdr: {
          MsgId: "BTCB012025011714374211853336",
          CreDtTm: "2025-01-17T14:37:44",
          InitgPty: {
            Id: {
              PrvtId: {
                Othr: {
                  Id: "0071",
                },
              },
            },
          },
        },
        OrgnlGrpInfAndSts: {
          OrgnlMsgId: "0001012025011718373600000000",
          OrgnlCreDtTm: "2025-01-17T18:37:36Z",
          OrgnlNbOfTxs: 1,
          OrgnlCtrlSum: 5.47,
          GrpSts: "ACCP",
        },
        OrgnlPmtInfAndSts: [
          {
            TxInfAndSts: [
              {
                OrgnlInstrId: "8a75417d-68cd-4e1e-8f8b-c67c0f620cc3",
                OrgnlEndToEndId: "81692025011714373911853306",
                TxSts: "ACCP",
                OrgnlTxRef: {
                  InstdAmt: {
                    Amt: 5.47,
                    Ccy: "VES",
                  },
                  IntrBkSttlmDt: "2025-01-17",
                  IntrBkSttlmNb: 1,
                  PmtTpInf: {
                    LclInstrm: {
                      Cd: "050",
                    },
                  },
                  Dbtr: {
                    Nm: "Alexander ",
                    Id: {
                      PrvtId: {
                        Othr: {
                          Id: "V3413756",
                          SchmeNm: {
                            Cd: "SCID",
                          },
                        },
                      },
                    },
                  },
                  DbtrAcct: {
                    Prxy: {
                      Tp: {
                        Cd: "CELE",
                      },
                      Id: "04242785127",
                    },
                  },
                  DbtrAgt: {
                    FinInstnId: {
                      ClrSysMmbId: {
                        ClrSysId: {
                          Cd: "NCCE",
                        },
                        MmbId: "0169",
                      },
                    },
                  },
                  CdtrAgt: {
                    FinInstnId: {
                      ClrSysMmbId: {
                        ClrSysId: {
                          Cd: "NCCE",
                        },
                        MmbId: "0169",
                      },
                    },
                  },
                  Cdtr: {
                    Nm: "Latin American Cable",
                    Id: {
                      PrvtId: {
                        Othr: {
                          Id: "J298946229",
                          SchmeNm: {
                            Cd: "SRIF",
                          },
                        },
                      },
                    },
                  },
                  CdtrAcct: {
                    Prxy: {
                      Tp: {
                        Cd: "CNTA",
                      },
                      Id: "01690001041000579342",
                    },
                  },
                  Purp: {
                    Cd: "002",
                  },
                  RmtInf: {
                    Ustrd: "DESCRIPCION DEL COBRO",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  };
  */

  try {
    logger.info(store?.canNotify, "emit_sse_can_notify");

    if (store?.canNotify) {
      const response = new Stream((stream) => {
        const interval = setInterval(() => {
          stream.send(JSON.stringify(store!.data));
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
          stream.close();
        }, 3000);
      });

      store.canNotify = false;

      logger.info(store!.data, "notification_sse");

      return response;
    }

    return new Stream((stream) => {
      const interval = setInterval(() => {
        stream.send({ message: "OK" });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        stream.close();
      }, 3000);
    });
  } catch (error) {
    logger.info(error, "sse_controller_error");
    set.status = 500;
    return {
      error: "Error interno de servidor",
    };
  }
}
