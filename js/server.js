const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 80 });

wss.on('connection', ws => {
  ws.send('Welcome Mohammad`s server!');

  ws.on('message', message => {
    
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);      
      // Broadcast the message to all clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
          console.log(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing message as JSON:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});
