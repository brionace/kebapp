import { Outlet, useLocation } from "react-router-dom";
import { Code2, User2 } from "lucide-react";
import { steps } from "../utils/navUtils";


export function Layout() {
  const location = useLocation();

  const getCurrentStep = () => {
    if (location.pathname === steps[1].path) return 0;
    if (location.pathname.startsWith(steps[1].path)) return 1;
    if (location.pathname.startsWith(steps[2].path)) return 2;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Code2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  bace51
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <User2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <li key={step.name} className="relative flex items-center">
                <div className="group relative flex flex-col items-center">
                  <span className="flex items-center">
                    <span
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-xl ${
                        index <= currentStep
                          ? "bg-indigo-600 hover:bg-indigo-800"
                          : "bg-gray-200"
                      }`}
                    >
                      {step.emoji}
                    </span>
                  </span>
                  <div className="text-sm font-medium text-gray-900 mt-2">
                    {step.name}
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`h-0.5 w-24 mx-4 ${
                      index < currentStep ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
