import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Excluir domínios padrão do SaaS
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const isDefaultDomain = 
    hostname === "mdsites.app" || 
    hostname === "www.mdsites.app" || 
    hostname.endsWith(".render.com") ||
    hostname.endsWith(".vercel.app");

  // Resolver subdomínios (ex: cafecentral.mdsites.app ou cafecentral.localhost:3000)
  if (isLocalhost) {
    const parts = hostname.split(":");
    const domainParts = parts[0].split(".");
    if (domainParts.length > 1 && domainParts[0] !== "localhost" && domainParts[0] !== "www") {
      const subdomain = domainParts[0];
      url.pathname = `/sites/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else if (!isDefaultDomain) {
    const domainParts = hostname.split(".");
    if (domainParts.length > 2 && domainParts[0] !== "www") {
      const subdomain = domainParts[0];
      url.pathname = `/sites/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Ignorar caminhos estáticos, APIs, arquivos públicos
    "/((?!api|_next/static|_next/image|assets|favicon.ico|logonovo.png|fundo-paginas.png).*)",
  ],
};
