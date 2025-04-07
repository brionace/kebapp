import { useState } from "react";
import { Menu, X } from "lucide-react";
import * as Icons from "lucide-react";

interface ClassicNavProps {
  config: {
    mainNav?: {
      display: string;
      primaryLinks: {
        label: string;
        href: string;
        style?: {
          bg: string;
          rounded: string;
        };
      }[];
      secondaryLinks: {
        label: string;
        href: string;
      }[];
      socials: {
        display: string;
        links: {
          label: string;
          href: string;
        }[];
      };
    };
  };
  onConfigChange: (key: string, value: unknown) => void;
}

export function ClassicNav({ config }: ClassicNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Early return if mainNav is not configured
  if (!config.mainNav) {
    return null;
  }

  type SocialLink = {
    platform: string;
    label: string;
    href: string;
    icon: string;
  };

  const renderSocialLink = (link: SocialLink) => {
    const IconComponent = Icons[
      link.icon as keyof typeof Icons
    ] as React.ElementType;

    switch (config?.mainNav?.socials.display) {
      case "icon-only":
        return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
      case "text-only":
        return link.label;
      case "icon-and-text":
        return (
          <span className="flex items-center gap-2">
            {IconComponent ? <IconComponent className="h-5 w-5" /> : null}
            {link.label}
          </span>
        );
      default:
        return link.label;
    }
  };

  return (
    <nav className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" />
        ) : (
          <Menu className="block h-6 w-6" />
        )}
      </button>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block absolute lg:relative top-full right-0 w-48 lg:w-auto mt-2 lg:mt-0 bg-white lg:bg-transparent py-2 lg:py-0 shadow-lg lg:shadow-none rounded-md lg:rounded-none z-50`}
      >
        <div
          className={`flex ${
            config.mainNav.display === "inline" ? "lg:flex-row" : "lg:flex-col"
          } gap-6`}
        >
          {/* Primary Links */}
          <ul
            className={`flex flex-col lg:flex-row gap-3 ${
              config.mainNav.display === "inline"
                ? "items-center"
                : "items-start"
            }`}
          >
            {config.mainNav.primaryLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className={`px-4 py-2 font-medium transition-colors ${
                    link.style?.bg || "bg-transparent"
                  } ${link.style?.rounded || ""} hover:bg-opacity-90`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Secondary Links */}
          <ul
            className={`flex flex-col lg:flex-row gap-3 ${
              config.mainNav.display === "inline"
                ? "items-center"
                : "items-start"
            }`}
          >
            {config.mainNav.secondaryLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Social Links */}
          <ul
            className={`flex flex-col lg:flex-row gap-3 ${
              config.mainNav.display === "inline"
                ? "items-center"
                : "items-start"
            }`}
          >
            {config.mainNav.socials.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {renderSocialLink(link as SocialLink)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
