import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "../data/templates";
import { steps } from "../utils/navUtils";

export function TemplateSelection() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center">
            Start
          </h1>
          <p className="mt-1 text-sm text-gray-500 text-center">
            What do you want to build?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="relative group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
            onClick={() => navigate(`${steps[1].path}/${template.id}`)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {template.name}
                </h3>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {template.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Next.js
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                {template.description}
              </p>
              <div className="mt-4">
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
