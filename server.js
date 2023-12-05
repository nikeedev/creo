const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8001 });

let clients = [];

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        let message = JSON.parse(data);

        console.log(message)
        
        switch (message.status) {
            case "join":
                ws.username = message.username;
                clients.push(ws);

                clients.forEach(client => {
                    if (!client.username == message.username) {
                        ws.send(data);
                    }
                })
                break;
        
            case "update":
                clients.forEach(client => {
                    if (!client.username == message.username) {
                        ws.send(data);
                    }
                })
                break;
                
            case "leave":
                clients.forEach(client => {
                    if (!client.username == message.username) {
                        ws.send(data);
                    } else {
                        delete clients[clients.indexOf(client)];
                    }
                })
                
                break;
            
            default:
                break;
        }
        
        ws.on("close", () => {
            ws.send(JSON.stringify(
                {
                    status: "leave",
                    username: ws.username,
                }
            ))
            clients.splice(clients.indexOf(ws), 1);
        })
    });
});