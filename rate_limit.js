const createRateLimiter = (options) => {
    const { windowMs, maxRequests } = options;
    const requestLog = [];

    // Hàm dọn dẹp yêu cầu cũ
    const cleanup = () => {
        const now = Date.now();
        requestLog.splice(0, requestLog.findIndex(entry => now - entry.timestamp <= windowMs));
    };

    return (req, res, next) => {
        cleanup(); // Dọn dẹp trước khi xử lý
        const ip = req.ip;
        const now = Date.now();
        const userRequests = requestLog.filter(entry => entry.ip === ip);

        const recentRequests = userRequests.filter(entry => now - entry.timestamp <= windowMs);
        if (recentRequests.length < maxRequests) {
            requestLog.push({ ip, timestamp: now });
            next();
        } else {
            res.status(429).send(`Rate limit exceeded. Max ${maxRequests} requests allowed in ${windowMs}ms.`);
        }
    };
};

// Cấu hình mặc định
const rateLimiter = createRateLimiter({
    windowMs: 5000, // 5 giây
    maxRequests: 2, // 2 yêu cầu
});

export { rateLimiter };