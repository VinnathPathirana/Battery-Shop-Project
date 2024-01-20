import { MantineProvider } from "@mantine/core";
import AllRoutes from "./routes";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';
const App = () => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications position="top-center" zIndex={2077}/>
      <ModalsProvider>
        <AllRoutes />
        </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
