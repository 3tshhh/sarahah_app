export const getDeviceInfo = (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    req.deviceInfo = `${userAgent}#${req.ip}`;
    next();
}