import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.PASSCODE_SECRET_KEY': JSON.stringify(process.env.PASSCODE_SECRET_KEY),
    },
})