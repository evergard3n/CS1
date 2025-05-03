import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
const redisPort = process.env.REDIS_PORT || 6379; // Mặc định cổng Redis là 6379

// Khởi tạo client Redis
const redisClient = createClient({
    socket: {
        host: 'localhost',
        port: redisPort,
    },
});

// Kết nối tới Redis và xử lý lỗi
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect().then(() => console.log('Connected to Redis'));

// Lấy giá trị từ cache
async function cacheGet(key) {
    try {
        const value = await redisClient.get(key);
        return value || null; // Trả về null nếu không tìm thấy
    } catch (err) {
        console.error(`Error getting cache for key ${key}: ${err.message}`);
        return null;
    }
}

// Lưu giá trị vào cache với TTL
async function cacheSet(key, value, ttl = 3600) {
    try {
        await redisClient.setEx(key, ttl, value); // setEx tự động đặt TTL (3600 giây)
    } catch (err) {
        console.error(`Error setting cache for key ${key}: ${err.message}`);
    }
}

export { cacheGet, cacheSet };