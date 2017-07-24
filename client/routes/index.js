import Home from "../javascript/components/home";
import Search from "../javascript/components/search";
import NotFound from "../javascript/components/404";
const routes = [
    {
        path: "/",
        component: Home,
        exact: true,
    },
    {
        path: "/search",
        component: Search,
        exact: true,
    },
    {component: NotFound}
];

export default routes;
