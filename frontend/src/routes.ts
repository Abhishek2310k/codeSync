import {
  type RouteConfig,
  route,
  layout
} from "@react-router/dev/routes";

export default [
  layout("./layout/layout.tsx", [
    route("/", "./App.tsx"),
    route("*", "./pages/404/notFound.tsx"),
  ])
] satisfies RouteConfig;
