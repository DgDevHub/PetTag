import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Constrói a URL do backend
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const backendUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`🔄 Proxy ${method} ${backendUrl}`);

    // Prepara os headers
    const headers: HeadersInit = {};
    
    // Copia headers importantes do request original
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Prepara o body para POST, PUT, PATCH
    let body: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      // Se for FormData, mantém como está
      if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else if (contentType?.includes('application/json')) {
        body = await request.text();
      } else {
        body = await request.text();
      }
    }

    // Faz a requisição para o backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      // Não redireciona automaticamente
      redirect: 'manual',
    });

    // Lê o corpo da resposta
    const responseText = await response.text();
    
    // Tenta parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`✅ Proxy ${method} ${backendUrl} - Status: ${response.status}`);

    // Retorna a resposta do backend
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('❌ Erro no proxy:', error.message);
    return NextResponse.json(
      { error: 'Erro ao conectar com o backend', details: error.message },
      { status: 500 }
    );
  }
}
