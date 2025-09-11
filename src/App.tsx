import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Providers from "./providers";
import HomePage from "./pages/home";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    handle: { meta: () => ({
        title: "Tamagosui Game",
        description:
          "Tamagosui is a virtual pet game inspired by Tamagotchi, where you care for and nurture a digital pet through various activities and interactions.",
      }),
    },
  },
]);

// export const metadata: Metadata {
//   title : "Tamagosui Game",
//   description: "Tamagosui is a virtual pet game inspired by Tamagotchi, where you care for and nurture a digital pet through various activities and interactions.",
// };

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  );
}

export default App;