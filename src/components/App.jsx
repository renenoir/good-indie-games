import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GlobalStyles from "../styles/global";
import Layout from "./layout/Layout";
import Loader from "./common/Loader";
import ErrorBoundary from "./ErrorBoundary";
import useOutline from "./hooks/useOutline";

const Catalog = lazy(() => import("./catalog/Catalog"));

function App() {
  useOutline();
  const [query, setQuery] = useState("");

  return (
    <Router>
      <GlobalStyles />
      <Layout query={query} setQuery={setQuery}>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact path="/">
                <Catalog query={query} />
              </Route>
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
}

export default App;
