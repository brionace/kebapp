import ReactDOMServer from "react-dom/server";
import { TEMPLATE_REGISTRY } from "../templates";

export function renderTemplate(
  templateId: string,
  config: Record<string, unknown>,
  onConfigChange: (key: string, value: unknown) => void
) {
  const TemplateComponent = TEMPLATE_REGISTRY[templateId] as React.FC<{
    config: Record<string, unknown>;
    onConfigChange: (key: string, value: unknown) => void;
  }>;
  if (!TemplateComponent) {
    throw new Error(`Template with id "${templateId}" not found.`);
  }

  return <TemplateComponent config={config} onConfigChange={onConfigChange} />;
}

interface RenderTemplateToHTMLConfig {
  config: Record<string, unknown>;
}

interface TemplateComponentProps {
  config: Record<string, unknown>;
}

export function renderTemplateToHTML(
  templateId: string,
  config: RenderTemplateToHTMLConfig["config"]
): string {
  const TemplateComponent = TEMPLATE_REGISTRY[
    templateId
  ] as React.FC<TemplateComponentProps>;
  if (!TemplateComponent) {
    throw new Error(`Template with id "${templateId}" not found.`);
  }

  // Convert JSX to HTML string
  return ReactDOMServer.renderToStaticMarkup(
    <TemplateComponent config={config} />
  );
}
