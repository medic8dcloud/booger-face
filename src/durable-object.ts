/// <reference types="@cloudflare/workers-types" />

export class DurableObject {
  state: DurableObjectState;
  env: any;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    try {
      if (method === 'GET') {
        return this.handleGet(url);
      } else if (method === 'POST') {
        return this.handlePost(url, request);
      } else if (method === 'PUT') {
        return this.handlePut(url, request);
      } else if (method === 'DELETE') {
        return this.handleDelete(url);
      }

      return new Response('Method not allowed', { status: 405 });
    } catch (error) {
      return new Response(`Error: ${error}`, { status: 500 });
    }
  }

  private async handleGet(url: URL): Promise<Response> {
    const key = url.searchParams.get('key') || 'data';
    const value = await this.state.storage?.get(key);
    
    return new Response(JSON.stringify({ key, value }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async handlePost(url: URL, request: Request): Promise<Response> {
    const data = await request.json() as Record<string, unknown>;
    const key = data.key as string || 'data';
    const value = data.value;

    await this.state.storage?.put(key, value);

    return new Response(JSON.stringify({ success: true, key, value }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  }

  private async handlePut(url: URL, request: Request): Promise<Response> {
    const data = await request.json() as Record<string, unknown>;
    const key = data.key as string || 'data';
    const value = data.value;

    await this.state.storage?.put(key, value);

    return new Response(JSON.stringify({ success: true, key, value }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async handleDelete(url: URL): Promise<Response> {
    const key = url.searchParams.get('key') || 'data';
    await this.state.storage?.delete(key);

    return new Response(JSON.stringify({ success: true, key, message: 'Deleted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
