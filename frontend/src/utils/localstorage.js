export const token_key = 'E_COMMERCE_TOKEN'

export const setToken = token => {
  window.localStorage.setItem(token_key, token)
}

export const getToken = () => {
  let token = window.localStorage.getItem(token_key)
  if (!!token) return token
  return false
}

export const isLogin = () => {
  if (!!getToken()) {
    return true
  }
  return false
}

export const logout = () => {
  window.localStorage.clear()
}


export const removeToken = () => {
  try {
    window.localStorage.removeItem(token_key);
    return true;
  } catch (error) {
    console.error('Failed to remove token:', error);
    return false;
  }
};
