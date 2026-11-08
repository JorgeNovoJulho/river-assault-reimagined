import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { ExpressPeerServer } from 'peer';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
if (!existsSync(new URL('../dist/index.html', import.meta.url))) {
  throw new Error('Compile o RiverStorm com npm run build antes de abrir a LAN.');
}
const { RIVER_LAN_BIND = '127.0.0.1', RIVER_LAN_PORT = '8080', RIVER_LAN_CERT, RIVER_LAN_KEY } = process.env;
if (Boolean(RIVER_LAN_CERT) !== Boolean(RIVER_LAN_KEY)) {
  throw new Error('Informe o certificado e a chave juntos.');
}
const app = express();
app.disable('x-powered-by');
const secure = Boolean(RIVER_LAN_CERT);
const server = secure
  ? createHttpsServer({ cert: readFileSync(RIVER_LAN_CERT), key: readFileSync(RIVER_LAN_KEY) }, app)
  : createHttpServer(app);
app.get('/river-lan-health', (_request, response) => response.json({ lan: true }));
app.use('/river-peer', ExpressPeerServer(server, { path: '/', allow_discovery: false, concurrent_limit: 64 }));
app.use(express.static(root));
server.listen(Number(RIVER_LAN_PORT), RIVER_LAN_BIND, () => {
  console.log('RiverStorm LAN em '+(secure?'https':'http')+'://'+RIVER_LAN_BIND+':'+RIVER_LAN_PORT+'/?lan=1');
});
