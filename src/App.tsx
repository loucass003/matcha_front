import "./App.css";
import { Routes } from "./router";
import { ApiProvider } from "./components/commons/ApiProvider";
import { SessionProvider } from "./components/commons/SessionProvider";
import SnackbarsProvider from "./components/commons/SnackbarsProvider";

function App() {
  return (
    <SnackbarsProvider>
      <SessionProvider>
        <ApiProvider>
          <Routes />
        </ApiProvider>
      </SessionProvider>
    </SnackbarsProvider>
  );
}

export default App;
