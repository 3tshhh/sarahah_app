export const OTPRedisModel = {
  prefix: 'otp',
  ttl: 900, // 15 minutes
  
  key: (email, type) => `${OTPRedisModel.prefix}_${type}:${email}`,
  
  types:{
    CONFIRM:'confirm',
    RESET:'reset'
  },
  fields: {
    code: 'code',
  }
};