import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import { useIconsStore } from "~/stores/iconsStore.js";
import { handle401Error } from "~/utils/errorHandler.js";
import { useReposeIconsStore } from "~/stores/reposeIconsStore.js";

export default function iconsRequests() {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
  const iconsStore = useIconsStore();
  const { setIcons } = iconsStore;
  const reposeIconsStore = useReposeIconsStore();
  const { setIconsForRepose } = reposeIconsStore
  const livingIconsStore = useLivingIconsStore();
  const { setIconsForLiving } = livingIconsStore

  function getAllIcons(isLiving) {
    const forLiving = 'filters[icon_categories][category][$eq]=prayerforhealth';
    const forRepose = 'filters[icon_categories][category][$eq]=forthedeparted';
    $fetch(`https://strapi.botinex.ru/api/icons?populate=*&${ isLiving ? forLiving : forRepose }`, getHeaders("GET", header, STRAPI_TOKEN))
      .then(response => {
        if (isLiving) {
          setIconsForLiving(response.data)
        } else {
          setIconsForRepose(response.data)
        }
        setIcons(response?.data);
      })
      .catch(error => {
        handle401Error(error);
      })
  }

  return { getAllIcons };
}

