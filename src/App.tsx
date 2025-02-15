import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Layout } from "./Layout";
import { initDB } from "./utils/dbUtils";

function App() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const element = useRoutes(routes);

  return <Layout>{element}</Layout>;
}

export default App;
