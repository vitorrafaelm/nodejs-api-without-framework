import http from 'node:http'; 
import { routes } from './routes/routes.js'; 
import { json } from './middleware/json.js';

import { extractQueryParams } from './utils/extract-query-params.js'; 

const server = http.createServer(async (req, res) => {
  const { method: methodH, url } = req; 

  await json(req, res); 

  const route = routes.find(({ method, path }) => {
    return method === methodH && path.test(url); 
  }); 

  if(route) {
    const routeParams = req.url.match(route.path); 
    
    const { query, ...params } = routeParams.groups; 

    req.params = params; 
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res); 
  }

  return res.writeHead(404).end(); 
}); 

server.listen(3333); 