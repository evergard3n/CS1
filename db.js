import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';

dotenv.config();
const dbURI = process.env.SQLITE_DB_PATH || './db/app.db';

// Khởi tạo kết nối Sequelize với SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbURI,
});

// Kiểm tra kết nối và log kết quả
sequelize.authenticate()
    .then(() => console.log('Connected to SQLite database'))
    .catch((err) => console.error('Failed to connect to SQLite database:', err));

// Định nghĩa schema cho bảng URL
const UrlSchema = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
};

// Tạo model Url từ schema
const Url = sequelize.define('Url', UrlSchema, {
    tableName: 'urls',
    timestamps: false,
});

// Thêm index để tối ưu truy vấn
Url.sync({ force: false }).then(() => {
    Url.addIndex({ fields: ['id'], name: 'idx_id' });
    Url.addIndex({ fields: ['url'], name: 'idx_url' });
});

export { Url };