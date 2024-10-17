import { io } from "socket.io-client";

// Connect to Socket.IO
const socket = io("http://localhost:5000");

export default socket;
