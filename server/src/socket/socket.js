import { Server } from "socket.io";

let io;
const userSocketMap = new Map(); // userId -> socketId
const roleSocketMap = new Map(); // role -> Set of socketIds

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "https://online-pantry.vercel.app"
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Client registers with userId and optional role
        socket.on("register", ({ userId, role }) => {
            if (userId) {
                userSocketMap.set(userId.toString(), socket.id);
                
                if (role) {
                    if (!roleSocketMap.has(role)) {
                        roleSocketMap.set(role, new Set());
                    }
                    roleSocketMap.get(role).add(socket.id);
                    socket.join(`role:${role}`);
                }
                
                console.log(`Registered user: ${userId} (${role || 'customer'}) with socket: ${socket.id}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            
            // Cleanup maps
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
            
            for (const [role, socketIds] of roleSocketMap.entries()) {
                if (socketIds.has(socket.id)) {
                    socketIds.delete(socket.id);
                    if (socketIds.size === 0) roleSocketMap.delete(role);
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToUser = (userId, event, data) => {
    if (!io || !userId) return;
    const socketId = userSocketMap.get(userId.toString());
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
};

export const broadcastToRole = (role, event, data) => {
    if (!io) return;
    io.to(`role:${role}`).emit(event, data);
};
