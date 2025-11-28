import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import { useIconsStore } from "~/stores/iconsStore.js";
import { handle401Error } from "~/utils/errorHandler.js";

export default function iconsRequests() {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
  const iconsStore = useIconsStore();
  const { setIcons } = iconsStore;

  function getAllIcons(params = {}) {
    const {
      locale = 'ru',
      page = 1,
      pageSize = 10
    } = params;

    const queryParams = new URLSearchParams({
      locale,
      'page': page.toString(),
      'pagination[pageSize]': pageSize.toString()
    });

    return $fetch(`https://strapi.botinex.ru/api/icons?populate=*`, getHeaders("GET", header, STRAPI_TOKEN))
      .then(response => {
        // Strapi может возвращать данные в формате { data: [...] } или просто массив
        const iconsData = response?.data || response || [];
        setIcons(Array.isArray(iconsData) ? iconsData : []);
        return response;
      })
      .catch(error => {
        handle401Error(error);
        return error;
      })
  }

  return { getAllIcons };
}

