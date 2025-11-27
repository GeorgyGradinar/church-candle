import { HEADER_PARAMETERS } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import { useAuthStore } from "~/stores/mainStore.js";
import storage from "~/mixins/localStorage.js";
import { CANDLE_USER_KEY } from "~/configs/localStorageKeys.js";

export default function authRequests() {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content];
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const { setUser } = authStore;
  const router = useRouter();
  const { getLocalStorage } = storage();

  function initStore() {
    setUser(getLocalStorage(CANDLE_USER_KEY));
    console.log(authStore.user?.accessToken)
    console.log(authStore.user)
    if (authStore.user?.accessToken) {
      getUserInfo();
    }
  }

  function getUserInfo() {
    const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
    $fetch(`https://saint.botinex.ru/auth/me`, getHeaders("GET", header))
      .then(response => {
        setUser(response.user);
      })
  }

  function registration(body) {
    return $fetch(`https://saint.botinex.ru/auth/register`, {
      ...getHeaders("POST", header),
      body,
    })
      .then(response => {
        setUser({ ...response.user, accessToken: response.accessToken });
        router.push('/');
      })
      .catch(error => {
        return error;
      })
  }

  function login(body) {
    return $fetch(`https://saint.botinex.ru/auth/login`, {
      ...getHeaders("POST", header),
      body,
    })
      .then((response) => {
        setUser({ ...response.user, accessToken: response.accessToken });
        router.push('/');
      })
      .catch((error) => {
        return error;
      })
  }

  return { registration, login, getUserInfo, initStore };
}