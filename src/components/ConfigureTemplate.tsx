import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { ClassicLanding } from "../templates/ClassicLanding";
import { BandLanding } from "../templates/BandLanding";
import { ClassicBlog } from "../templates/ClassicBlog";
import { BlankTemplate } from "../templates/BlankTemplate";
import { DevicePreview } from "./DevicePreview";
import { TEMPLATES } from "../data/templates";
import { ConfigSidebar } from "./ConfigSidebar";
import { CharityLanding } from "../templates/CharityLanding";
import { steps } from "../utils/navUtils";

// const BACKGROUND_OPTIONS = [
//   { label: "None", value: "bg-transparent" },
//   { label: "White", value: "bg-white text-gray-900" },
//   { label: "Light Gray", value: "bg-gray-100 text-gray-900" },
//   { label: "Indigo", value: "bg-indigo-600 text-white" },
//   { label: "Blue", value: "bg-blue-600 text-white" },
//   { label: "Green", value: "bg-green-600 text-white" },
// ];

// const ROUNDED_OPTIONS = [
//   { label: "None", value: "" },
//   { label: "Small", value: "rounded" },
//   { label: "Medium", value: "rounded-md" },
//   { label: "Large", value: "rounded-lg" },
//   { label: "Full", value: "rounded-full" },
// ];

export function ConfigureTemplate() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find((t) => t.id === templateId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [config, setConfig] = useState(() => {
    if (!template) return {};

    // Initialize config with all schema defaults
    const initialConfig = Object.entries(template.configSchema).reduce(
      (acc, [key, schema]) => {
        if (schema.type === "object" && schema.properties) {
          // Handle nested object schemas
          acc[key] = Object.entries(schema.properties).reduce(
            (objAcc, [propKey, propSchema]) => {
              if (propSchema.type === "object" && propSchema.properties) {
                // Handle doubly nested objects (like mainNav.socials)
                objAcc[propKey] = Object.entries(propSchema.properties).reduce(
                  (nestedAcc, [nestedKey, nestedSchema]) => {
                    nestedAcc[nestedKey] = nestedSchema.default;
                    return nestedAcc;
                  },
                  {} as Record<string, any>
                );
              } else {
                objAcc[propKey] = propSchema.default;
              }
              return objAcc;
            },
            {} as Record<string, any>
          );
        } else {
          acc[key] = schema.default;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return initialConfig;
  });

  console.log(template, templateId, TEMPLATES);

  if (!template) {
    return <div>Template not found</div>;
  }

  const handleConfigChange = (
    key: string,
    value: [] | object | string | number | boolean | null
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinueToBuild = () => {
    const projectId = "demo-" + Date.now();
    navigate(`${steps[2].path}/${projectId}`, {
      state: {
        config,
        templateType: template.category,
      },
    });
  };

  const updateNestedConfig = (
    path: string[],
    value: any,
    currentConfig: any
  ) => {
    const newConfig = { ...currentConfig };
    let target = newConfig;
    path.slice(0, -1).forEach((key) => {
      target = target[key];
    });
    target[path[path.length - 1]] = value;
    return newConfig;
  };

  interface Schema {
    items?: {
      default?: Record<string, [] | object | string | number | boolean | null>;
    };
    label: string;
  }

  const handleAddArrayItem = (path: string[], schema: Schema) => {
    const currentArray = path.reduce((obj, key) => obj[key], config) || [];
    const newItem = schema.items?.default || {};
    console.log(currentArray, newItem);
    const updatedArray = [
      ...currentArray,
      { ...newItem, title: `New ${schema.label.slice(0, -1)}` },
    ];
    const newConfig = updateNestedConfig(path, updatedArray, config);
    setConfig(newConfig);
  };

  const handleRemoveArrayItem = (
    key: string,
    index: number,
    path: string[]
  ) => {
    const newArray = path.reduce((obj, key) => obj[key], config) || [];
    newArray.splice(index, 1);
    handleConfigChange(key, newArray);
  };

  const handleAddLink = (path: string[], defaultLink: string) => {
    const current = path.reduce((obj, key) => obj[key], config);
    const newLinks = [...current, { ...defaultLink }];
    const newConfig = { ...config };
    let target = newConfig;
    path.slice(0, -1).forEach((key) => {
      target = target[key];
    });
    target[path[path.length - 1]] = newLinks;
    setConfig(newConfig);
  };

  const handleRemoveLink = (path: string[], index: number) => {
    const newConfig = { ...config };
    let target = newConfig;
    path.slice(0, -1).forEach((key) => {
      target = target[key];
    });
    const newLinks = [...target[path[path.length - 1]]];
    newLinks.splice(index, 1);
    target[path[path.length - 1]] = newLinks;
    setConfig(newConfig);
  };

  const handleToggleShow = (key: string, value: boolean) => {
    const newConfig = { ...config };
    newConfig[key].show = value;
    setConfig(newConfig);
  };

  const renderTemplate = () => {
    switch (template.category) {
      case "landing":
        return (
          <ClassicLanding config={config} onConfigChange={handleConfigChange} />
        );
      case "blog":
        return (
          <ClassicBlog config={config} onConfigChange={handleConfigChange} />
        );
      case "blank":
        return (
          <BlankTemplate config={config} onConfigChange={handleConfigChange} />
        );
      case "band":
        return (
          <BandLanding config={config} onConfigChange={handleConfigChange} />
        );
      case "charity":
        return (
          <CharityLanding config={config} onConfigChange={handleConfigChange} />
        );
      default:
        return null;
    }
  };

  // const renderNavigation = (schema: any) => {
  //   if (!config.mainNav || !schema.properties) {
  //     return null;
  //   }

  //   return (
  //     <div className="space-y-6">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Display Style
  //         </label>
  //         <select
  //           value={config.mainNav.display}
  //           onChange={(e) =>
  //             handleConfigChange("mainNav", {
  //               ...config.mainNav,
  //               display: e.target.value,
  //             })
  //           }
  //           className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //         >
  //           {schema.properties.display.options.map((option: string) => (
  //             <option key={option} value={option} className="capitalize">
  //               {option}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div>
  //         <div className="flex justify-between items-center mb-2">
  //           <label className="block text-sm font-medium text-gray-700">
  //             Primary Links
  //           </label>
  //           <button
  //             onClick={() =>
  //               handleAddLink(["mainNav", "primaryLinks"], {
  //                 label: "New Link",
  //                 href: "/",
  //                 style: {
  //                   bg: "bg-transparent",
  //                   rounded: "",
  //                 },
  //               })
  //             }
  //             className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200"
  //           >
  //             <Plus className="h-3 w-3 mr-1" />
  //             Add Link
  //           </button>
  //         </div>
  //         {config.mainNav.primaryLinks.map((link: any, index: number) => (
  //           <div
  //             key={index}
  //             className="space-y-2 mb-4 p-4 border border-gray-200 rounded-lg"
  //           >
  //             <div className="flex items-center gap-2">
  //               <input
  //                 type="text"
  //                 value={link.label}
  //                 onChange={(e) => {
  //                   const newLinks = [...config.mainNav.primaryLinks];
  //                   newLinks[index] = { ...link, label: e.target.value };
  //                   handleConfigChange("mainNav", {
  //                     ...config.mainNav,
  //                     primaryLinks: newLinks,
  //                   });
  //                 }}
  //                 placeholder="Link Label"
  //                 className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //               />
  //               <input
  //                 type="text"
  //                 value={link.href}
  //                 onChange={(e) => {
  //                   const newLinks = [...config.mainNav.primaryLinks];
  //                   newLinks[index] = { ...link, href: e.target.value };
  //                   handleConfigChange("mainNav", {
  //                     ...config.mainNav,
  //                     primaryLinks: newLinks,
  //                   });
  //                 }}
  //                 placeholder="URL"
  //                 className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //               />
  //               <button
  //                 onClick={() =>
  //                   handleRemoveLink(["mainNav", "primaryLinks"], index)
  //                 }
  //                 className="p-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50"
  //               >
  //                 <Trash className="h-4 w-4" />
  //               </button>
  //             </div>
  //             <div className="grid grid-cols-2 gap-2">
  //               <div>
  //                 <label className="block text-xs font-medium text-gray-500 mb-1">
  //                   Background
  //                 </label>
  //                 <select
  //                   value={link.style?.bg || "bg-transparent"}
  //                   onChange={(e) => {
  //                     const newLinks = [...config.mainNav.primaryLinks];
  //                     newLinks[index] = {
  //                       ...link,
  //                       style: { ...link.style, bg: e.target.value },
  //                     };
  //                     handleConfigChange("mainNav", {
  //                       ...config.mainNav,
  //                       primaryLinks: newLinks,
  //                     });
  //                   }}
  //                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //                 >
  //                   {BACKGROUND_OPTIONS.map((option) => (
  //                     <option key={option.value} value={option.value}>
  //                       {option.label}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>
  //               <div>
  //                 <label className="block text-xs font-medium text-gray-500 mb-1">
  //                   Rounded
  //                 </label>
  //                 <select
  //                   value={link.style?.rounded || ""}
  //                   onChange={(e) => {
  //                     const newLinks = [...config.mainNav.primaryLinks];
  //                     newLinks[index] = {
  //                       ...link,
  //                       style: { ...link.style, rounded: e.target.value },
  //                     };
  //                     handleConfigChange("mainNav", {
  //                       ...config.mainNav,
  //                       primaryLinks: newLinks,
  //                     });
  //                   }}
  //                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //                 >
  //                   {ROUNDED_OPTIONS.map((option) => (
  //                     <option key={option.value} value={option.value}>
  //                       {option.label}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       <div>
  //         <div className="flex justify-between items-center mb-2">
  //           <label className="block text-sm font-medium text-gray-700">
  //             Secondary Links
  //           </label>
  //           <button
  //             onClick={() =>
  //               handleAddLink(["mainNav", "secondaryLinks"], {
  //                 label: "New Link",
  //                 href: "/",
  //               })
  //             }
  //             className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200"
  //           >
  //             <Plus className="h-3 w-3 mr-1" />
  //             Add Link
  //           </button>
  //         </div>
  //         {config.mainNav.secondaryLinks.map((link: any, index: number) => (
  //           <div key={index} className="flex items-center gap-2 mb-2">
  //             <input
  //               type="text"
  //               value={link.label}
  //               onChange={(e) => {
  //                 const newLinks = [...config.mainNav.secondaryLinks];
  //                 newLinks[index] = { ...link, label: e.target.value };
  //                 handleConfigChange("mainNav", {
  //                   ...config.mainNav,
  //                   secondaryLinks: newLinks,
  //                 });
  //               }}
  //               placeholder="Link Label"
  //               className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //             />
  //             <input
  //               type="text"
  //               value={link.href}
  //               onChange={(e) => {
  //                 const newLinks = [...config.mainNav.secondaryLinks];
  //                 newLinks[index] = { ...link, href: e.target.value };
  //                 handleConfigChange("mainNav", {
  //                   ...config.mainNav,
  //                   secondaryLinks: newLinks,
  //                 });
  //               }}
  //               placeholder="URL"
  //               className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //             />
  //             <button
  //               onClick={() =>
  //                 handleRemoveLink(["mainNav", "secondaryLinks"], index)
  //               }
  //               className="p-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50"
  //             >
  //               <Trash className="h-4 w-4" />
  //             </button>
  //           </div>
  //         ))}
  //       </div>

  //       <div>
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium text-gray-700 mb-2">
  //             Social Links Display
  //           </label>
  //           <select
  //             value={config.mainNav.socials.display}
  //             onChange={(e) =>
  //               handleConfigChange("mainNav", {
  //                 ...config.mainNav,
  //                 socials: {
  //                   ...config.mainNav.socials,
  //                   display: e.target.value,
  //                 },
  //               })
  //             }
  //             className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //           >
  //             {schema.properties.socials.properties.display.options.map(
  //               (option: string) => (
  //                 <option key={option} value={option} className="capitalize">
  //                   {option.split("-").join(" ")}
  //                 </option>
  //               )
  //             )}
  //           </select>
  //         </div>

  //         <div className="flex justify-between items-center mb-2">
  //           <label className="block text-sm font-medium text-gray-700">
  //             Social Links
  //           </label>
  //           <button
  //             onClick={() =>
  //               handleAddLink(["mainNav", "socials", "links"], {
  //                 platform: "twitter",
  //                 label: "Twitter",
  //                 href: "https://twitter.com",
  //                 icon: "Twitter",
  //               })
  //             }
  //             className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200"
  //           >
  //             <Plus className="h-3 w-3 mr-1" />
  //             Add Social
  //           </button>
  //         </div>
  //         {config.mainNav.socials.links.map((link: any, index: number) => (
  //           <div key={index} className="flex items-center gap-2 mb-2">
  //             <input
  //               type="text"
  //               value={link.platform}
  //               onChange={(e) => {
  //                 const newLinks = [...config.mainNav.socials.links];
  //                 newLinks[index] = { ...link, platform: e.target.value };
  //                 handleConfigChange("mainNav", {
  //                   ...config.mainNav,
  //                   socials: { ...config.mainNav.socials, links: newLinks },
  //                 });
  //               }}
  //               placeholder="Platform"
  //               className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //             />
  //             <input
  //               type="text"
  //               value={link.label}
  //               onChange={(e) => {
  //                 const newLinks = [...config.mainNav.socials.links];
  //                 newLinks[index] = { ...link, label: e.target.value };
  //                 handleConfigChange("mainNav", {
  //                   ...config.mainNav,
  //                   socials: { ...config.mainNav.socials, links: newLinks },
  //                 });
  //               }}
  //               placeholder="Label"
  //               className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //             />
  //             <input
  //               type="text"
  //               value={link.href}
  //               onChange={(e) => {
  //                 const newLinks = [...config.mainNav.socials.links];
  //                 newLinks[index] = { ...link, href: e.target.value };
  //                 handleConfigChange("mainNav", {
  //                   ...config.mainNav,
  //                   socials: { ...config.mainNav.socials, links: newLinks },
  //                 });
  //               }}
  //               placeholder="URL"
  //               className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  //             />
  //             <button
  //               onClick={() =>
  //                 handleRemoveLink(["mainNav", "socials", "links"], index)
  //               }
  //               className="p-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50"
  //             >
  //               <Trash className="h-4 w-4" />
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center">
            Customize
          </h1>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Make it your own! Customize the template to fit your needs.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleContinueToBuild}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                # Continue to Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DevicePreview>{renderTemplate()}</DevicePreview>
      </div>

      <ConfigSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        template={template}
        config={config}
        onConfigChange={handleConfigChange}
        onAddArrayItem={handleAddArrayItem}
        onRemoveArrayItem={handleRemoveArrayItem}
        onAddLink={handleAddLink}
        onRemoveLink={handleRemoveLink}
        onToggleShow={handleToggleShow}
      />
    </div>
  );
}
