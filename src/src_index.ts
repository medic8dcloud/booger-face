import { DurableObject } from './durable-object';

export { DurableObject };

export default {
  fetch: handleRequest,
};

async function handleRequest(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Route to Durable Object
  if (path.startsWith('/api/')) {
    const id = env.STATE.idFromName('default');
    const obj = env.STATE.get(id);
    return obj.fetch(request);
  }

  // Default response
  return new Response('🍺 Booger Face API Ready!\nface full uh of drinks!', {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export interface Env {
  STATE: DurableObjectNamespace;
}