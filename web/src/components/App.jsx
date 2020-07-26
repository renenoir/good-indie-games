import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GlobalStyles from "../styles/global";
import Layout from "./layout/Layout";
import Loader from "./common/Loader";
import ErrorBoundary from "./ErrorBoundary";
import useOutline from "../hooks/useOutline";
import { UserProvider } from "../hooks/useUser";
import { LoginOpenProvider } from "../hooks/useLoginOpen";

const Catalog = lazy(() => import("./catalog/Catalog"));

function App() {
  useOutline();
  const [query, setQuery] = useState("");

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Router>
          <GlobalStyles />
          <UserProvider>
            <LoginOpenProvider>
              <Layout query={query} setQuery={setQuery}>
                <Switch>
                  <Route exact path="/">
                    <Catalog query={query} />
                  </Route>
                  <Route exact path="/saved">
                    <Catalog query={query} modifier="saved" />
                  </Route>
                </Switch>
              </Layout>
            </LoginOpenProvider>
          </UserProvider>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
