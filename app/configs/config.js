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