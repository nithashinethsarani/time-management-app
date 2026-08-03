import { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    );

    const requestPermission = async () => {
        if (typeof Notification === 'undefined') return;
        const result = await Notification.requestPermission();
        setPermission(result);
    };

    const sendNotification = (title, options) => {
        if (permission === 'granted') {
            new Notification(title, options);
        }
    };

    return (
        <NotificationContext.Provider value={{ permission, requestPermission, sendNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}