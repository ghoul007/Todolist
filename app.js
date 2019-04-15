const express = require('express');
const http = require('http');
const ent = require('ent');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const todolist = [];
const PORT = 8086;

app.use(express.static('views'))

.get('/todo', function(request, response) {
    response.render('todo.ejs');
})

// Redirige vers la todolist si la page demandée n'est pas trouvée
.use(function(request, response, next) {
    response.redirect('/todo');
});

io.sockets.on('connection', function(socket, pseudo) {

    // Quand l'utilisateur est connecté, envoi de la liste mise à jour
    socket.emit('updateTask', todolist);

    // Ajout d'une tâche à la liste
    socket.on('addTask', function(task) {
        task = ent.encode(task);
        todolist.push(task);
        io.sockets.emit('updateTask', todolist);
        console.log(todolist); // Debug
    });

    // Suppression d'une tâche
    socket.on('delTask', function(index) {
        todolist.splice(index, 1);
        io.sockets.emit('updateTask', todolist);
    });
});

server.listen(PORT);