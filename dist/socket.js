"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const message_validation_1 = require("./app/modules/message/message.validation");
const socketServer = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(socketServer);
io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle join room event
    socket.on('join-room', (groupId) => __awaiter(void 0, void 0, void 0, function* () {
        // Join the specified chat group room
        console.log(groupId);
        if (groupId) {
            socket.join(groupId);
            console.log(`User joined room ${groupId}`);
        }
        // Fetch and send previous messages in the room
    }));
    // Handle new message event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on('send-message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        // Save the message to the database
        // Send the new message to all users in the chat group room
        try {
            console.log(message);
            yield message_validation_1.MessageValidation.createValidation.parseAsync({
                body: message,
            });
            io.to(message.orderId).emit('receive-message', message);
        }
        catch (err) {
            console.error(err);
        }
    }));
    // Handle join room event
    socket.on('leave-room', (orderId) => __awaiter(void 0, void 0, void 0, function* () {
        // Join the specified chat group room
        if (orderId) {
            socket.leave(orderId);
            console.log(`User leave room ${orderId}`);
        }
        // Fetch and send previous messages in the room
    }));
    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
exports.default = socketServer;
