import { HEADER_PARAMETERS } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import { handle401Error } from "~/utils/errorHandler.js";

export default function candlesRequests() {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];

  function getAllCandles() {
    return $fetch(`https://saint.botinex.ru/candles`, getHeaders("GET", header))
      .then(response => {
        return response;
      })
      .catch(error => {
        handle401Error(error);
        return error;
      })
  }

  function createCandle(body) {
    return $fetch(`https://saint.botinex.ru/candles`, {
      ...getHeaders("POST", header),
      body,
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        handle401Error(error);
        return error;
      })
  }

  return { getAllCandles, createCandle };
}

