import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Snackbar, Alert } from '@mui/material';

interface SocketContextType {
    socket: Socket | null;
    notifications: any[];
    unreadCount: number;
    markAllAsRead: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<any[]>(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });
    const [unreadCount, setUnreadCount] = useState(() => {
        const saved = localStorage.getItem('unreadCount');
        return saved ? parseInt(saved) : 0;
    });
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('unreadCount', unreadCount.toString());
    }, [unreadCount]);

    useEffect(() => {
        let newSocket: Socket;

        if (isAuthenticated && user?._id) {
            // Strip /api/v1 from the URL to get the base server URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const socketUrl = apiUrl.includes('/api/v1')
                ? apiUrl.replace('/api/v1', '')
                : new URL(apiUrl).origin;

            newSocket = io(socketUrl, {
                transports: ['polling', 'websocket'],
                withCredentials: true
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                newSocket.emit('register', { userId: user._id, role: user.role });
                setToastOpen(true);
                setToastMessage('Real-time connection established 🟢');
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                setToastOpen(true);
                setToastMessage(`Connection failed: ${err.message} 🔴`);
            });

            newSocket.on('order_update', (data) => {
                console.log('Notification received:', data);
                setNotifications((prev) => [data, ...prev]);
                setUnreadCount((prev) => prev + 1);
                setToastOpen(true);
                setToastMessage(data.message);

                // Play sound (optional)
                try {
                    const audio = new Audio('/notification.mp3'); // If exists
                    audio.play().catch(e => console.log('Audio play failed', e));
                } catch (e) { }
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                // Optional: show disconnect toast
            });

            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [isAuthenticated, user]);

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    // Improved Clear: Clear list option?
    const clearNotifications = () => {
        setNotifications([]);
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markAllAsRead }}>
            {children}
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ zIndex: 9999, top: 80 }} // Below header
            >
                <Alert onClose={handleToastClose} severity="info" sx={{ width: '100%', bgcolor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
