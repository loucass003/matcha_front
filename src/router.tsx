import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from "react-router-dom";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { MainLayout } from "./components/layouts/MainLayout";
import { SignIn } from "./components/pages/auth/SignIn";
import { SignUp } from "./components/pages/auth/SignUp";
import { Home } from "./components/pages/Home";
import { NotFound } from "./components/pages/NotFound";

const RedirectAs404 = ({ location }: RouteProps) => (
  <Redirect to={{ ...location, state: { is404: true } }} />
);

const AllRoutes = () => (
  <Switch>
    <Route path="/auth">
      <AuthLayout>
        <Switch>
          <Route path="/auth/sign-in" component={SignIn} />
          <Route path="/auth/sign-up" component={SignUp} />
          <Route component={RedirectAs404} />
        </Switch>
      </AuthLayout>
    </Route>

    <Route>
      <MainLayout>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </MainLayout>
    </Route>
    <Route component={RedirectAs404} />
  </Switch>
);

export function Routes() {
  return (
    <Router>
      <Route
        render={({ location }: any) =>
          location.state && location.state.is404 ? <NotFound /> : <AllRoutes />
        }
      />
    </Router>
  );
}
