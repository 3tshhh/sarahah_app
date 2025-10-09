export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  if (err.message == "jwt expired") {
    err.message = "invalid token, please request a new link";
  }
  if (err.message == "data and hash arguments required") {
    err.message = "otp failed, please request a new link";
  }
  res.status(500).json({ message: "something broke!", error: err.message });
};
