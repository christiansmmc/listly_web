import {createRoot} from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import {RoomProvider} from "./context/RoomContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RoomItemsProvider} from "./context/RoomItemsContext.tsx";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RoomProvider>
            <RoomItemsProvider>
                <QueryClientProvider client={queryClient}>
                    <App/>
                </QueryClientProvider>
            </RoomItemsProvider>
        </RoomProvider>
    </AuthProvider>
)
