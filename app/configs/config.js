import { useRuntimeConfig } from "nuxt/app";

export const API_URL = () => {
  const config = useRuntimeConfig();
  return config.public.API_URL
}

export const HEADER_PARAMETERS = {
  content: {
    key: "Content-Type",
    body: 'application/json'
  },
  accept: {
    key: 'Accept',
    body: 'application/json'
  },
  authorization: {
    key: 'Authorization',
    body: 'Bearer'
  },
  disposition: {
    key: 'Content-Disposition',
    body: 'form-data'
  }
}

export const STRAPI_TOKEN = '333e5a65359c9bac834107d6e2e91575ef14e0fb6700b6c4143d4d3e671db8a3799cf444666d379fd453ac96301f9a559a91439990535ccc4e76f4d0af274e532fa5a6cc2770768cbc345aef68d640dffa3c112b71f45474b4e639dce736556f0d629ca7eb5b1f1fed968ea83060d61e2a75e911497190a829bf17f0c14ca997';