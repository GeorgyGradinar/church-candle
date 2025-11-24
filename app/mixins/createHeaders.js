
export default function getHeaders(typeRequest, payload) {
  // const mainStore = useUserStore();
  let myHeaders = new Headers();
  payload.forEach(headerElement => {
    if (headerElement.key === 'Authorization') {
      // myHeaders.append(headerElement.key, `${ headerElement.body } ${ mainStore.userData?.access_token }`);
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
