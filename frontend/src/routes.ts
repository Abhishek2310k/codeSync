import {
    type RouteConfig,
    route,
  } from "@react-router/dev/routes";
  
  export default [
    route("/", "./App.tsx"),
    route("*?", "./pages/404/notFound.tsx"),
  ] satisfies RouteConfig;
  