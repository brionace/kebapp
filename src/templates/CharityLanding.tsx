type CharityLandingConfig = {
  title: {
    type: "string";
    label: "Page Title";
    default: "Support Our Cause";
  };
  heroSection: {
    type: "object";
    label: "Hero Section";
    properties: {
      heading: {
        type: "string";
        label: "Heading";
        default: "Make a Difference Today";
      };
      subheading: {
        type: "string";
        label: "Subheading";
        default: "Join us in our mission to create a better world.";
      };
      backgroundImage: {
        type: "string";
        label: "Background Image URL";
        default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
      };
    };
  };
  donationCTA: {
    type: "object";
    label: "Donation Call-to-Action";
    properties: {
      heading: {
        type: "string";
        label: "Heading";
        default: "Your Support Matters";
      };
      buttonText: {
        type: "string";
        label: "Button Text";
        default: "Donate Now";
      };
      donationLink: {
        type: "string";
        label: "Donation Link";
        default: "https://example.com/donate";
      };
    };
  };
  featuredCauses: {
    type: "array";
    label: "Featured Causes";
    default: Array<{
      title: string;
      description: string;
      imageUrl: string;
    }>;
    items: {
      type: "object";
      label: "Cause";
      properties: {
        title: {
          type: "string";
          label: "Title";
          default: "";
        };
        description: {
          type: "string";
          label: "Description";
          default: "";
        };
        imageUrl: {
          type: "string";
          label: "Image URL";
          default: "";
        };
      };
    };
  };
  contactSection: {
    type: "object";
    label: "Contact Section";
    properties: {
      heading: {
        type: "string";
        label: "Heading";
        default: "Get in Touch";
      };
      email: {
        type: "string";
        label: "Contact Email";
        default: "contact@example.com";
      };
      phone: {
        type: "string";
        label: "Contact Phone";
        default: "+1 234 567 890";
      };
    };
  };
};

interface CharityLandingProps {
  config: CharityLandingConfig;
  onConfigChange?: (key: string, value: unknown) => void;
}

export function CharityLanding({ config }: CharityLandingProps) {
  console.log(config);
  return (
    <div className="charity-landing">
      {/* Hero Section */}
      <section
        className="hero-section py-16"
        style={{
          backgroundImage: `url(${config.heroSection?.properties.backgroundImage.default})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl font-bold">
            {config.heroSection?.properties.heading.default}
          </h1>
          <p className="mt-4 text-lg">
            {config.heroSection?.properties.subheading.default}
          </p>
        </div>
      </section>

      {/* Donation Call-to-Action */}
      <section className="donation-cta py-12 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold">
          {config.donationCTA?.properties.heading.default}
        </h2>
        <a
          href={config.donationCTA?.properties.donationLink.default}
          className="mt-4 inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow hover:bg-gray-100"
        >
          {config.donationCTA?.properties.buttonText.default}
        </a>
      </section>

      {/* Featured Causes */}
      <section className="featured-causes py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Causes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.featuredCauses?.default.map((cause, index: number) => (
              <div
                key={index}
                className="cause-card bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={cause.imageUrl}
                  alt={cause.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{cause.title}</h3>
                  <p className="mt-2 text-gray-600">{cause.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-12 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">
            {config.contactSection?.properties.heading.default}
          </h2>
          <p className="mt-4">
            Email: {config.contactSection?.properties.email.default} | Phone:{" "}
            {config.contactSection?.properties.phone.default}
          </p>
        </div>
      </section>
    </div>
  );
}
