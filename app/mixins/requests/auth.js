import { API_URL, HEADER_PARAMETERS } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js"

export default function authRequests() {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content];

  // function registration(body) {
  //   return $fetch(`${ API_URL() }/v1/auth/register`, {
  //     ...getHeaders("POST", header),
  //     body,
  //   })
  //     .then(response => {
  //       return response
  //     })
  //     .catch(error => {
  //       return error
  //     })
  // }

  function registration(body) {
    console.log(API_URL())
      $fetch(`https://saint.botinex.ru/auth/register`, {
        ...getHeaders("POST", header),
        body,
      })
        .then(response => {
        })
        .catch(error => {
        })
  }

  return { registration }
}