import { useAuthStore } from "~/stores/mainStore.js";

export default function getHeaders(typeRequest, payload, token) {
  const authStore = useAuthStore();
  let myHeaders = new Headers();
  payload.forEach(headerElement => {
    if (headerElement.key === 'Authorization') {
    console.log(authStore.user)
      myHeaders.append(headerElement.key, `${ headerElement.body } ${ token || authStore.user?.accessToken }`);
    } else {
      myHeaders.append(headerElement.key, headerElement.body);
    }
  });

  return {
    method: typeRequest,
    headers: myHeaders,
    redirect: 'follow'
  };
}
