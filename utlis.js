import { cacheGet, cacheSet } from './redis.js';
import { Url } from './database.js';

// Tạo ID ngẫu nhiên với độ dài xác định
function generateId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
}

// Kiểm tra URL hợp lệ bằng regex
function validateUrl(url) {
    const regex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
    return regex.test(url);
}

// Tạo ID mới, đảm bảo không trùng lặp
async function getNewId() {
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const newId = generateId(5);
        const existingUrl = await getUrl(newId);
        if (!existingUrl) {
            return newId;
        }
    }
    throw new Error(`Failed to generate a unique ID after ${maxAttempts} attempts`);
}

// Tạo URL ngắn mới
async function createShortUrl(url) {
    if (!validateUrl(url)) {
        throw new Error(`Invalid URL format: ${url}`);
    }

    const newId = await getNewId();
    await Url.create({ id: newId, url });
    await cacheSet(newId, url);
    return newId;
}

// Lấy URL từ ID, có sử dụng cache
async function getUrl(id) {
    try {
        const cachedUrl = await cacheGet(id);
        if (cachedUrl) {
            return cachedUrl;
        }

        const data = await Url.findOne({ where: { id } });
        if (!data) {
            return null;
        }

        await cacheSet(id, data.url);
        return data.url;
    } catch (err) {
        console.error(`Error fetching URL for ID ${id}: ${err.message}`);
        return null;
    }
}

// Lấy ID từ URL
async function getIdByUrl(url) {
    try {
        const data = await Url.findOne({ where: { url } });
        return data ? data.id : null;
    } catch (err) {
        console.error(`Error fetching ID for URL ${url}: ${err.message}`);
        return null;
    }
}

export { createShortUrl, getUrl, getIdByUrl };