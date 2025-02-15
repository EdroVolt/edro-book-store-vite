import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Layout } from "./layout";

function App() {
  const element = useRoutes(routes);

  return <Layout>{element}</Layout>;
}

export default App;
