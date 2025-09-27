export const authorizationMiddleware = (roles) => {
  return (req, res, next) => {
    const {user:{role}} = req
    if (roles.includes(role)) {
        return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  };
};
