// error handling middleware
export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "something broke!", error: err.message });
};