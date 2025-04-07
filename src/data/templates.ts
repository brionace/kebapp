import type { Template } from "../types";

export const TEMPLATES: Template[] = [
  {
    id: "band-landing",
    name: "Band Website",
    description:
      "A dynamic website template for bands and musicians with tour dates, music releases, and video gallery.",
    thumbnail: "https://images.unsplash.com/photo-1501612780327-45045538702b",
    category: "band",
    framework: "nextjs",
    configSchema: {
      bandName: {
        type: "string",
        label: "Band Name",
        default: "The Band Name",
      },
      tagline: {
        type: "string",
        label: "Tagline",
        default: "New Album Out Now",
      },
      heroImage: {
        type: "string",
        label: "Hero Background Image",
        default: "https://images.unsplash.com/photo-1501612780327-45045538702b",
      },
      ctaText: {
        type: "string",
        label: "CTA Button Text",
        default: "Listen Now",
      },
      mainNav: {
        type: "object",
        label: "Navigation",
        show: true,
        properties: {
          display: {
            type: "string",
            label: "Display Style",
            default: "default",
            options: ["default", "inline"],
          },
          primaryLinks: {
            type: "array",
            label: "Primary Links",
            default: [
              { label: "Music", href: "#music" },
              { label: "Tour", href: "#tour" },
              { label: "Videos", href: "#videos" },
            ],
          },
          secondaryLinks: {
            type: "array",
            label: "Secondary Links",
            default: [
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ],
          },
          socials: {
            type: "object",
            label: "Social Links",
            properties: {
              display: {
                type: "string",
                label: "Display Style",
                default: "icon-and-text",
                options: ["icon-only", "text-only", "icon-and-text"],
              },
              links: {
                type: "array",
                label: "Social Links",
                default: [
                  {
                    platform: "spotify",
                    label: "Spotify",
                    href: "https://spotify.com",
                    icon: "Music",
                  },
                  {
                    platform: "youtube",
                    label: "YouTube",
                    href: "https://youtube.com",
                    icon: "Youtube",
                  },
                  {
                    platform: "instagram",
                    label: "Instagram",
                    href: "https://instagram.com",
                    icon: "Instagram",
                  },
                ],
              },
            },
          },
        },
      },
      latestRelease: {
        type: "object",
        label: "Releases",
        show: true,
        properties: {
          label: {
            type: "string",
            label: "Section Label",
            default: "Latest Release",
          },
          title: {
            type: "string",
            label: "Album Title",
            default: "New Album Title",
          },
          coverArt: {
            type: "string",
            label: "Cover Art URL",
            default:
              "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc",
          },
          releaseDate: {
            type: "string",
            label: "Release Date",
            default: "Out Now",
          },
          streamingLinks: {
            type: "array",
            label: "Streaming Links",
            default: [
              { platform: "Spotify", url: "https://spotify.com" },
              { platform: "Apple Music", url: "https://music.apple.com" },
              { platform: "Bandcamp", url: "https://bandcamp.com" },
            ],
          },
        },
      },
      upcomingShows: {
        type: "object",
        label: "Shows",
        show: true,
        properties: {
          label: {
            type: "string",
            label: "Section Label",
            default: "Upcoming Shows",
          },
          items: {
            type: "array",
            label: "Shows",
            default: [
              {
                date: "Mar 15, 2024",
                venue: "The Venue",
                location: "New York, NY",
                ticketUrl: "https://tickets.com",
                style: {
                  bg: "bg-zinc-800",
                  rounded: "rounded-lg",
                  shadow: "shadow-lg",
                  backgroundImage: "",
                  backgroundOverlay: "bg-opacity-100",
                },
              },
              {
                date: "Mar 20, 2024",
                venue: "Music Hall",
                location: "Los Angeles, CA",
                ticketUrl: "https://tickets.com",
                style: {
                  bg: "bg-zinc-800",
                  rounded: "rounded-lg",
                  shadow: "shadow-lg",
                  backgroundImage: "",
                  backgroundOverlay: "bg-opacity-100",
                },
              },
            ],
          },
        },
      },
      musicVideos: {
        type: "object",
        label: "Videos",
        show: true,
        properties: {
          label: {
            type: "string",
            label: "Section Label",
            default: "Music Videos",
          },
          items: {
            type: "array",
            label: "Videos",
            default: [
              {
                title: "Latest Music Video",
                thumbnailUrl:
                  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
                videoUrl: "https://youtube.com",
                style: {
                  bg: "bg-black",
                  rounded: "rounded-lg",
                  shadow: "shadow-lg",
                  backgroundImage: "",
                  backgroundOverlay: "bg-opacity-75",
                },
              },
              {
                title: "Live Performance",
                thumbnailUrl:
                  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
                videoUrl: "https://youtube.com",
                style: {
                  bg: "bg-black",
                  rounded: "rounded-lg",
                  shadow: "shadow-lg",
                  backgroundImage: "",
                  backgroundOverlay: "bg-opacity-75",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    id: "blank",
    name: "Start from Scratch",
    description:
      "Build your custom web app by selecting from our library of pre-built components.",
    thumbnail:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    category: "blank",
    framework: "nextjs",
    configSchema: {
      title: { type: "string", label: "Website Title", default: "My Web App" },
      description: {
        type: "string",
        label: "Website Description",
        default: "A custom web application",
      },
      mainNav: {
        type: "object",
        label: "Navigation",
        properties: {
          display: {
            type: "string",
            label: "Display Style",
            default: "default",
            options: ["default", "inline"],
          },
          primaryLinks: {
            type: "array",
            label: "Primary Links",
            default: [
              {
                label: "Home",
                href: "/",
                style: {
                  bg: "bg-indigo-600 text-white",
                  rounded: "rounded-md",
                },
              },
              {
                label: "Features",
                href: "/features",
                style: {
                  bg: "bg-transparent",
                  rounded: "",
                },
              },
            ],
          },
          secondaryLinks: {
            type: "array",
            label: "Secondary Links",
            default: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
          },
          socials: {
            type: "object",
            label: "Social Links",
            properties: {
              display: {
                type: "string",
                label: "Display Style",
                default: "icon-and-text",
                options: ["icon-only", "text-only", "icon-and-text"],
              },
              links: {
                type: "array",
                label: "Social Links",
                default: [
                  {
                    platform: "twitter",
                    label: "Twitter",
                    href: "https://twitter.com",
                    icon: "Twitter",
                  },
                  {
                    platform: "github",
                    label: "GitHub",
                    href: "https://github.com",
                    icon: "Github",
                  },
                ],
              },
            },
          },
        },
      },
      components: {
        type: "array",
        label: "Components",
        default: ["ClassicHeader"],
      },
    },
  },
  {
    id: "modern-landing",
    name: "Modern Landing Page",
    description:
      "A clean and modern landing page template with hero section, features, and CTA.",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "landing",
    framework: "nextjs",
    configSchema: {
      title: {
        type: "string",
        label: "Website Title",
        default: "My Landing Page",
      },
      heroTitle: {
        type: "string",
        label: "Hero Title",
        default: "Welcome to our platform",
      },
      heroSubtitle: {
        type: "string",
        label: "Hero Subtitle",
        default: "The best solution for your needs",
      },
      ctaText: {
        type: "string",
        label: "CTA Button Text",
        default: "Get Started",
      },
      primaryColor: {
        type: "string",
        label: "Primary Color",
        default: "#4F46E5",
      },
      mainNav: {
        type: "object",
        label: "Navigation",
        properties: {
          display: {
            type: "string",
            label: "Display Style",
            default: "default",
            options: ["default", "inline"],
          },
          primaryLinks: {
            type: "array",
            label: "Primary Links",
            default: [
              { label: "Home", href: "/" },
              { label: "Features", href: "/features" },
            ],
          },
          secondaryLinks: {
            type: "array",
            label: "Secondary Links",
            default: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
          },
          socials: {
            type: "object",
            label: "Social Links",
            properties: {
              display: {
                type: "string",
                label: "Display Style",
                default: "icon-and-text",
                options: ["icon-only", "text-only", "icon-and-text"],
              },
              links: {
                type: "array",
                label: "Social Links",
                default: [
                  {
                    platform: "twitter",
                    label: "Twitter",
                    href: "https://twitter.com",
                    icon: "Twitter",
                  },
                  {
                    platform: "github",
                    label: "GitHub",
                    href: "https://github.com",
                    icon: "Github",
                  },
                ],
              },
            },
          },
        },
      },
      seo: {
        type: "string",
        label: "Page description",
        default: "Our landing page description goes here",
      },
      features: {
        type: "array",
        label: "Features",
        default: [
          {
            title: "Feature 1",
            description: "Description of feature 1",
            style: {
              bg: "bg-white",
              rounded: "rounded-lg",
              shadow: "shadow-sm",
              backgroundImage: "",
              backgroundOverlay: "bg-opacity-100",
            },
          },
          {
            title: "Feature 2",
            description: "Description of feature 2",
            style: {
              bg: "bg-white",
              rounded: "rounded-lg",
              shadow: "shadow-sm",
              backgroundImage: "",
              backgroundOverlay: "bg-opacity-100",
            },
          },
          {
            title: "Feature 3",
            description: "Description of feature 3",
            style: {
              bg: "bg-white",
              rounded: "rounded-lg",
              shadow: "shadow-sm",
              backgroundImage: "",
              backgroundOverlay: "bg-opacity-100",
            },
          },
        ],
      },
    },
  },
  {
    id: "classic-blog",
    name: "Personal Blog",
    description:
      "A minimalist blog template with great typography and reading experience.",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    category: "blog",
    framework: "nextjs",
    configSchema: {
      blogTitle: { type: "string", label: "Blog Title", default: "My Blog" },
      authorName: { type: "string", label: "Author Name", default: "John Doe" },
      bio: {
        type: "string",
        label: "Author Bio",
        default: "Writer & Developer",
      },
      mainNav: {
        type: "object",
        label: "Navigation",
        properties: {
          display: {
            type: "string",
            label: "Display Style",
            default: "default",
            options: ["default", "inline"],
          },
          primaryLinks: {
            type: "array",
            label: "Primary Links",
            default: [
              { label: "Blog", href: "/blog" },
              { label: "Archive", href: "/archive" },
            ],
          },
          secondaryLinks: {
            type: "array",
            label: "Secondary Links",
            default: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
          },
          socials: {
            type: "object",
            label: "Social Links",
            properties: {
              display: {
                type: "string",
                label: "Display Style",
                default: "icon-and-text",
                options: ["icon-only", "text-only", "icon-and-text"],
              },
              links: {
                type: "array",
                label: "Social Links",
                default: [
                  {
                    platform: "twitter",
                    label: "Twitter",
                    href: "https://twitter.com",
                    icon: "Twitter",
                  },
                  {
                    platform: "github",
                    label: "GitHub",
                    href: "https://github.com",
                    icon: "Github",
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  {
    id: "charity-landing",
    name: "Charity",
    description:
      "A modern landing page template for charities and non-profits to showcase their mission and encourage donations.",
    thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    category: "charity",
    framework: "nextjs",
    configSchema: {
      title: {
        type: "string",
        label: "Page Title",
        default: "Support Our Cause",
      },
      heroSection: {
        type: "object",
        label: "Hero Section",
        properties: {
          heading: {
            type: "string",
            label: "Heading",
            default: "Make a Difference Today",
          },
          subheading: {
            type: "string",
            label: "Subheading",
            default: "Join us in our mission to create a better world.",
          },
          backgroundImage: {
            type: "string",
            label: "Background Image URL",
            default:
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          },
        },
      },
      donationCTA: {
        type: "object",
        label: "Donation Call-to-Action",
        properties: {
          heading: {
            type: "string",
            label: "Heading",
            default: "Your Support Matters",
          },
          buttonText: {
            type: "string",
            label: "Button Text",
            default: "Donate Now",
          },
          donationLink: {
            type: "string",
            label: "Donation Link",
            default: "https://example.com/donate",
          },
        },
      },
      featuredCauses: {
        type: "array",
        label: "Featured Causes",
        default: [
          {
            title: "Clean Water Initiative",
            description: "Providing clean water to communities in need.",
            imageUrl:
              "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
          },
          {
            title: "Education for All",
            description:
              "Ensuring access to education for underprivileged children.",
            imageUrl:
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
          },
        ],
        items: {
          type: "object",
          label: "Cause",
          properties: {
            title: {
              type: "string",
              label: "Title",
              default: "",
            },
            description: {
              type: "string",
              label: "Description",
              default: "",
            },
            imageUrl: {
              type: "string",
              label: "Image URL",
              default: "",
            },
          },
        },
      },
      contactSection: {
        type: "object",
        label: "Contact Section",
        properties: {
          heading: {
            type: "string",
            label: "Heading",
            default: "Get in Touch",
          },
          email: {
            type: "string",
            label: "Contact Email",
            default: "contact@example.com",
          },
          phone: {
            type: "string",
            label: "Contact Phone",
            default: "+1 234 567 890",
          },
        },
      },
    },
  },
];
