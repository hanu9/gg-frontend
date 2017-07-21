import Home from "../javascript/components/home";
import About from "../javascript/components/about";
import NotFound from "../javascript/components/404";
const routes = [
    // {path:"/",component:"",loadData: () => getSomeData(), routes: []}
    {name: "home", path: "/", exact:true, component: Home},
    {name: "about", path: "/about", exact:true, component: About},
    {name: "404", component: NotFound}
];

export default routes;
