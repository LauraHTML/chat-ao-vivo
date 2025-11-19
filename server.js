const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);

        // Receber mensagem 
        socket.on('send-message', (data) => {
            // Broadcast para todos
            io.emit('receive-message', {
                id: Date.now(),
                user: data.user,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Desconectando
        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });

        //salas de chat
        socket.on('join-room', (room) => {
            socket.join(room);
        });

        socket.on('send-message', (data) => {
            io.to(data.room).emit('receive-message', data);
        });

        // Cliente
        socket.emit('typing', username);

        // Servidor
        socket.on('typing', (user) => {
            socket.broadcast.emit('user-typing', user);
        });
    });


    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Servidor rodando em http://localhost:${PORT}`);

    });
});

