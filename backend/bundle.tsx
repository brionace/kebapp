
      import React from "react";
      import ReactDOM from "react-dom/client"; 
      import { TEMPLATE_REGISTRY } from "../src/templates/index";
      import "../src/index.css"; // Import Tailwind CSS

      const config = {"bandName":"The Band Name","tagline":"New Album Out Now","heroImage":"https://images.unsplash.com/photo-1501612780327-45045538702b","ctaText":"Listen Now","mainNav":{"display":"default","primaryLinks":[{"label":"Music","href":"#music"},{"label":"Tour","href":"#tour"},{"label":"Videos","href":"#videos"}],"secondaryLinks":[{"label":"About","href":"#about"},{"label":"Contact","href":"#contact"}],"socials":{"display":"icon-and-text","links":[{"platform":"spotify","label":"Spotify","href":"https://spotify.com","icon":"Music"},{"platform":"youtube","label":"YouTube","href":"https://youtube.com","icon":"Youtube"},{"platform":"instagram","label":"Instagram","href":"https://instagram.com","icon":"Instagram"}]}},"latestRelease":{"label":"Latest Release","title":"New Album Title","coverArt":"https://images.unsplash.com/photo-1526478806334-5fd488fcaabc","releaseDate":"Out Now","streamingLinks":[{"platform":"Spotify","url":"https://spotify.com"},{"platform":"Apple Music","url":"https://music.apple.com"},{"platform":"Bandcamp","url":"https://bandcamp.com"}]},"upcomingShows":{"label":"Upcoming Shows","items":[{"date":"Mar 15, 2024","venue":"The Venue","location":"New York, NY","ticketUrl":"https://tickets.com","style":{"bg":"bg-zinc-800","rounded":"rounded-lg","shadow":"shadow-lg","backgroundImage":"","backgroundOverlay":"bg-opacity-100"}},{"date":"Mar 20, 2024","venue":"Music Hall","location":"Los Angeles, CA","ticketUrl":"https://tickets.com","style":{"bg":"bg-zinc-800","rounded":"rounded-lg","shadow":"shadow-lg","backgroundImage":"","backgroundOverlay":"bg-opacity-100"}}]},"musicVideos":{"label":"Music Videos","items":[{"title":"Latest Music Video","thumbnailUrl":"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae","videoUrl":"https://youtube.com","style":{"bg":"bg-black","rounded":"rounded-lg","shadow":"shadow-lg","backgroundImage":"","backgroundOverlay":"bg-opacity-75"}},{"title":"Live Performance","thumbnailUrl":"https://images.unsplash.com/photo-1540039155733-5bb30b53aa14","videoUrl":"https://youtube.com","style":{"bg":"bg-black","rounded":"rounded-lg","shadow":"shadow-lg","backgroundImage":"","backgroundOverlay":"bg-opacity-75"}}]}};
      const TemplateComponent = TEMPLATE_REGISTRY["band-landing"];

      if (!TemplateComponent) {
        throw new Error("TemplateComponent not found in TEMPLATE_REGISTRY");
      }

      const rootElement = document.getElementById("root");
      if (!rootElement) {
        throw new Error("Root element not found in the DOM");
      }

      const root = ReactDOM.createRoot(rootElement); // Use createRoot for React 18+
      root.render(React.createElement(TemplateComponent, { config }));
    