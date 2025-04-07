import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TemplateSelection } from "./components/TemplateSelection";
import { ConfigureTemplate } from "./components/ConfigureTemplate";
import { PreviewAndBuild } from "./components/PreviewAndBuild";
import { steps } from "./utils/navUtils";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={steps[0].path} element={<Layout />}>
          <Route index element={<TemplateSelection />} />
          <Route
            path={`${steps[1].path}/:templateId`}
            element={<ConfigureTemplate />}
          />
          <Route
            path={`${steps[2].path}/:projectId`}
            element={<PreviewAndBuild />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
