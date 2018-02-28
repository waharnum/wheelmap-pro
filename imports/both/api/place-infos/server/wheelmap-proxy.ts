import {HTTP} from 'meteor/http';
import {WebApp} from 'meteor/webapp';
import * as Fiber from 'fibers';
import * as http from 'http';

WebApp.connectHandlers.use('/proxy/wheelmap/', (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url || '';
  const requestIsAllowed =
    req.method === 'GET' &&
    url.startsWith('/');

  if (requestIsAllowed) {
    Fiber(function () {
      try {
        const wheelmapResponse = HTTP.get(`https://wheelmap.org/${url.substr(1)}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        res.writeHead(wheelmapResponse.statusCode || 400, wheelmapResponse.headers);
        res.end(wheelmapResponse.content);
      } catch {
        res.writeHead(400);
        res.end('Exception thrown');
      }
    }).run();
  } else {
    res.writeHead(400);
    res.end('Computer says no.');
  }
});
