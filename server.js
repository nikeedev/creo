const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8800 });

/** @type {Array<WebSocket>} */
let clients = [];

wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify(
        {
            status: "list",
            data: clients.map(client => client.data),
        }
    ));   

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log(clients);
        let message = JSON.parse(data);

        console.log(message)
        
        switch (message.status) {
            case "join":
                ws.data = message;
                clients.push(ws);

                clients.forEach(client => {
                    if (!client.data.username == message.username) {
                        ws.send(data);
                    }
                })
                break;
        
            case "update":
                clients.forEach(client => {
                    if (!client.data.username == message.username) {
                        ws.send(data);
                    }
                })
                break;
                
            case "leave":
                clients.forEach(client => {
                    if (!client.data.username == message.username) {
                        ws.send(data);
                    } else {
                        clients.splice(clients.indexOf(client), 1);
                        client.close();
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