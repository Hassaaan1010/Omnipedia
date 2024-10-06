const tokenValid = async (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTimeInSecs = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTimeInSecs;
};

export { tokenValid };
