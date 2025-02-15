import { RouteObject } from "react-router-dom";
import { Shop } from "./pages/Shop";
import { Stores } from "./pages/Stores";
import { Author } from "./pages/Author";
import { Books } from "./pages/Books";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Shop />,
  },
  {
    path: "/stores",
    element: <Stores />,
  },
  {
    path: "/author",
    element: <Author />,
  },
  {
    path: "/books",
    element: <Books />,
  },
];
