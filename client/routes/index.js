import Home from "../javascript/components/home";
import NotFound from "../javascript/components/404";
const routes = [
    {
        path: "/",
        component: Home,
        exact: true,
    },
    {component: NotFound}
];

export default routes;
