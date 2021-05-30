import "./App.css";
import { Routes } from "./router";
import { ApiProvider } from "./components/commons/ApiProvider";
import { SessionProvider } from "./components/commons/SessionProvider";

function App() {
  return (
    <SessionProvider>
      <ApiProvider>
        <Routes />
      </ApiProvider>
    </SessionProvider>
  );
}

export default App;
