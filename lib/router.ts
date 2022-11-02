
export type RequestData = {
    params: Record<string, string>
}

export type Handler = (req: Request, data?: RequestData) => Response;

export type RoutesObject = {
  [key: string]: Handler | RoutesObject;
};

export type InternalRoute = {
  matcher: URLPattern;
  handler: Handler;
};
export type Route = {
  path: string;
  handler: Handler;
};

export class Router {
  public routes: InternalRoute[];

  handleNotFound(): Response {
    return new Response("<h1>404 - Page does not exist </h1>", {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  constructor(routes: Route[]) {
    this.routes = routes.map((r) => ({
      matcher: new URLPattern({ pathname: r.path }),
      handler: r.handler,
    }));
  }

  handleRequest(req: Request): Response {
    for (const route of this.routes) {
      const match = route.matcher.exec(req.url)
      if (match) {
        return route.handler(req, { params: match.pathname.groups });
      }
    }

    return this.handleNotFound();
  }
}

export function createRouter(routesObject: RoutesObject): Router {
  const concatenatePaths = (
    routesObj: RoutesObject,
    prefix: string,
  ): RoutesObject => {
    const newObj: RoutesObject = {};

    console.log("concatenando");

    for (const key in routesObj) {
      newObj[prefix + key] = routesObj[key];
    }

    return newObj;
  };

  const traverseRoutes = (routeGroup: RoutesObject): Route[] => {
    return Object.keys(routeGroup).map((key) => {
      const route = routeGroup[key];

      if (typeof route === "function") {
        console.log("rota function");
        return {
          path: key,
          handler: route as Handler,
        };
      }
      return traverseRoutes(concatenatePaths(route, key));
    }).flat(1);
  };

  const routes: Route[] = traverseRoutes(routesObject);

  return new Router(routes);
}
