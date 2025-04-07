import { EditableContent } from "../components/EditableContent";
import { ClassicNav } from "./nav/ClassicNav";
import * as Popover from "@radix-ui/react-popover";
import { Settings } from "lucide-react";
import { StyleEditor } from "../components/StyleEditor";

interface BandLandingProps {
  config: {
    bandName: string;
    tagline: string;
    heroImage: string;
    ctaText: string;
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
    latestRelease: {
      label: { default: string };
      title: string;
      coverArt: string;
      releaseDate: string;
      streamingLinks: Array<{
        platform: string;
        url: string;
      }>;
    };
    upcomingShows: {
      label: { default: string };
      shows: Array<{
        date: string;
        venue: string;
        location: string;
        ticketUrl: string;
        style: {
          bg: string;
          rounded: string;
          shadow: string;
          backgroundImage: string;
          backgroundOverlay: string;
        };
      }>;
    };
    musicVideos: {
      label: { default: string };
      videos: Array<{
        title: string;
        thumbnailUrl: string;
        videoUrl: string;
        style: {
          bg: string;
          rounded: string;
          shadow: string;
          backgroundImage: string;
          backgroundOverlay: string;
        };
      }>;
    };
  };
  onConfigChange: (key: string, value: unknown) => void;
}

export function BandLanding({ config, onConfigChange }: BandLandingProps) {
  console.log(config);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="relative">
        <div
          className="absolute inset-0 bg-center bg-cover z-0"
          style={{
            backgroundImage: `url(${config.heroImage})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              {/* <EditableContent
                content={config.bandName}
                onChange={(value) => onConfigChange("bandName", value)}
                className="text-2xl font-bold tracking-wider"
              /> */}
              <h1 className="text-2xl font-bold tracking-wider">
                {config.bandName}
              </h1>
              <ClassicNav config={config} onConfigChange={onConfigChange} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            {/* <EditableContent
              content={config.tagline}
              onChange={(value) => onConfigChange("tagline", value)}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            /> */}
            {/* <EditableContent
              content={config.ctaText}
              onChange={(value) => onConfigChange("ctaText", value)}
              className="inline-block px-8 py-4 text-lg font-medium bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            /> */}
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {config.tagline}
            </h2>
            <a
              href=""
              className="inline-block px-8 py-4 text-lg font-medium bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            >
              {config.ctaText}
            </a>
          </div>
        </div>
      </header>

      {/* Latest Release */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <EditableContent
            content={config.latestRelease?.label?.default}
            onChange={(value) =>
              onConfigChange("latestRelease", {
                ...config.latestRelease,
                label: { ...config.latestRelease.label, default: value },
              })
            }
            className="text-3xl font-bold mb-12 text-center"
          /> */}
          <h2 className="text-3xl font-bold mb-12 text-center">
            {config.latestRelease?.label?.default}
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <img
                src={config.latestRelease.coverArt}
                alt={config.latestRelease.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <EditableContent
                content={config.latestRelease.title}
                onChange={(value) =>
                  onConfigChange("latestRelease", {
                    ...config.latestRelease,
                    title: value,
                  })
                }
                className="text-4xl font-bold"
              />
              <EditableContent
                content={config.latestRelease.releaseDate}
                onChange={(value) =>
                  onConfigChange("latestRelease", {
                    ...config.latestRelease,
                    releaseDate: value,
                  })
                }
                className="text-zinc-400"
              />
              <div className="flex flex-wrap gap-4">
                {config.latestRelease.streamingLinks?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <EditableContent
            content={config.upcomingShows?.label?.default}
            onChange={(value) =>
              onConfigChange("upcomingShows", {
                ...config.upcomingShows,
                label: { ...config.upcomingShows.label, default: value },
              })
            }
            className="text-3xl font-bold mb-12 text-center"
          /> */}
          <h2 className="text-3xl font-bold mb-12 text-center">
            {config.upcomingShows?.label?.default}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.upcomingShows?.shows?.map((show, index) => (
              <div key={index} className="group/show relative">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      aria-label="Settings"
                      className="absolute -right-2 -top-2 p-1 rounded-full bg-white shadow-md opacity-0 group-hover/show:opacity-100 transition-opacity z-10"
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      className="bg-white rounded-lg shadow-xl"
                      sideOffset={5}
                    >
                      <StyleEditor
                        style={show.style}
                        onChange={(newStyle) => {
                          const newShows = [...config.upcomingShows.shows];
                          newShows[index] = { ...show, style: newStyle };
                          onConfigChange("upcomingShows", {
                            ...config.upcomingShows,
                            shows: newShows,
                          });
                        }}
                      />
                      <Popover.Arrow className="fill-white" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
                <div
                  className={`p-6 ${show.style.bg} ${show.style.rounded} ${show.style.shadow}`}
                  style={
                    show.style.backgroundImage
                      ? {
                          backgroundImage: `url(${show.style.backgroundImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div
                    className={
                      show.style.backgroundImage
                        ? show.style.backgroundOverlay
                        : ""
                    }
                  >
                    <EditableContent
                      content={show.date}
                      onChange={(value) => {
                        const newShows = [...config.upcomingShows.shows];
                        newShows[index] = { ...show, date: value };
                        onConfigChange("upcomingShows", {
                          ...config.upcomingShows,
                          shows: newShows,
                        });
                      }}
                      className="text-lg font-bold mb-2"
                    />
                    <EditableContent
                      content={show.venue}
                      onChange={(value) => {
                        const newShows = [...config.upcomingShows.shows];
                        newShows[index] = { ...show, venue: value };
                        onConfigChange("upcomingShows", {
                          ...config.upcomingShows,
                          shows: newShows,
                        });
                      }}
                      className="text-xl mb-1"
                    />
                    <EditableContent
                      content={show.location}
                      onChange={(value) => {
                        const newShows = [...config.upcomingShows.shows];
                        newShows[index] = { ...show, location: value };
                        onConfigChange("upcomingShows", {
                          ...config.upcomingShows,
                          shows: newShows,
                        });
                      }}
                      className="text-zinc-400 mb-4"
                    />
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                      Get Tickets
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Music Videos */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <EditableContent
            content={config.musicVideos?.label?.default}
            onChange={(value) =>
              onConfigChange("musicVideos", {
                ...config.musicVideos,
                label: { ...config.musicVideos.label, default: value },
              })
            }
            className="text-3xl font-bold mb-12 text-center"
          /> */}
          <h2 className="text-3xl font-bold mb-12 text-center">
            {config.musicVideos?.label?.default}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.musicVideos?.videos?.map((video, index) => (
              <div key={index} className="group/video relative">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      aria-label="Settings"
                      className="absolute -right-2 -top-2 p-1 rounded-full bg-white shadow-md opacity-0 group-hover/video:opacity-100 transition-opacity z-10"
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      className="bg-white rounded-lg shadow-xl"
                      sideOffset={5}
                    >
                      <StyleEditor
                        style={video.style}
                        onChange={(newStyle) => {
                          const newVideos = [...config.musicVideos.videos];
                          newVideos[index] = { ...video, style: newStyle };
                          onConfigChange("musicVideos", {
                            ...config.musicVideos,
                            videos: newVideos,
                          });
                        }}
                      />
                      <Popover.Arrow className="fill-white" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
                <div
                  className={`relative overflow-hidden ${video.style.rounded} ${video.style.shadow}`}
                  style={{
                    backgroundImage: `url(${video.thumbnailUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                  }}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${video.style.backgroundOverlay}`}
                  >
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </a>
                    <EditableContent
                      content={video.title}
                      onChange={(value) => {
                        const newVideos = [...config.musicVideos.videos];
                        newVideos[index] = { ...video, title: value };
                        onConfigChange("musicVideos", {
                          ...config.musicVideos,
                          videos: newVideos,
                        });
                      }}
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-lg font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
