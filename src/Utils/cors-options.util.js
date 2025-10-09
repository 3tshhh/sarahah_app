const whitelist = process.env.WHITE_LISTED_ORIGINS;

export const corsOptions = {
  origin: function (origin, callback) {

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
