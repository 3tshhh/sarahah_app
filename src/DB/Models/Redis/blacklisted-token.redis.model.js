export const BlackListedTokenRedisModel = {
  prefix: 'BLtoken',
  ttl: "token's expireDate in seconds",
  
  key: (tokenId) => `${BlackListedTokenRedisModel.prefix}:${tokenId}`,

  fields: {
    userId: 'userId',
  }
};