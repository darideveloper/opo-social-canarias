import type { APIRoute } from 'astro'

export const ALL: APIRoute = async ({ params, request }) => {

    // get backend api base from .env
    const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE

    /// --- Read cookies ---
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [key, ...v] = c.trim().split('=');
            return [key, decodeURIComponent(v.join('='))];
        })
    )

    // get api call data
    const { path } = params
    const { method } = request;
    const accessToken = cookies.access_token
    const contentType = request.headers.get('Content-Type')

    // Read body of request
    let body: BodyInit | null = null
    const requestBody = request.body
    if (requestBody && method !== 'GET' && method !== 'HEAD') {
        body = await request.arrayBuffer()
    }

    // Add back slash to endpoint if not present
    let endpoint = `${PUBLIC_API_BASE}/${path}`
    if (!endpoint.endsWith('/')) {
        endpoint += '/'
    }

    // Send same request to backend api
    const backendResponse = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': contentType || 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        },
        body: body,
        redirect: 'follow',
        credentials: 'include',
    } as RequestInit)

    return backendResponse
}
