import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GlobalStyles from "../styles/global";
import Layout from "./layout/Layout";
import Loader from "./common/Loader";
import ErrorBoundary from "./ErrorBoundary";
import useOutline from "../hooks/useOutline";
import { UserProvider } from "../hooks/useUser";
import { LoginOpenProvider } from "../hooks/useLoginOpen";
import Detail from "./catalog/Detail";
import { CatalogProvider } from "../contexts/catalog";

const Catalog = lazy(() => import("./catalog/Catalog"));

function App() {
  useOutline();

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <UserProvider>
          <CatalogProvider>
            <Router>
              <GlobalStyles />
              <LoginOpenProvider>
                <Layout>
                  <Switch>
                    <Route exact path="/">
                      <Catalog />
                    </Route>
                    <Route exact path="/saved">
                      <Catalog modifier="saved" />
                    </Route>
                    <Route path={`/:id`}>
                      <Detail />
                    </Route>
                  </Switch>
                </Layout>
              </LoginOpenProvider>
            </Router>
          </CatalogProvider>
        </UserProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
