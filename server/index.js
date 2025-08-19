import dotenv from 'dotenv';
dotenv.config();

// --- Các import cơ bản ---
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';

// --- Các import cho Socket.IO ---
import http from 'http';
import { Server } from 'socket.io';

// --- Các import cho Routes ---
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import cartRouter from './routes/cart.route.js';
import myListRouter from './routes/mylist.route.js';
import addressRouter from './routes/address.route.js';
import bannerRouter from './routes/banner.router.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';
import adminOrderRouter from './routes/adminOrder.route.js';
import reviewRouter from './routes/review.route.js';
import blogRouter from './routes/blog.route.js';

// --- KHỞI TẠO APP VÀ SERVER ---
const app = express();
const server = http.createServer(app);

// --- KHỞI TẠO SOCKET.IO ---
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- MIDDLEWARES ---
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// --- TÍCH HỢP SOCKET.IO VÀO APP ---
app.set('socketio', io);

// --- LẮNG NGHE KẾT NỐI SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});


// --- CÁC ROUTE CỦA API ---
app.get("/", (request, response) => {
    response.json({ message: "Server is running on port " + process.env.PORT });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use("/api/mylist", myListRouter);
app.use("/api/address", addressRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/blogs', blogRouter);

// --- KẾT NỐI DATABASE VÀ KHỞI ĐỘNG SERVER ---
connectDB().then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`🚀 Server is running on port ${process.env.PORT || 8000}`);
    });
});