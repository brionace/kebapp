import { BandLanding } from "./BandLanding";
import { CharityLanding } from "./CharityLanding";
import { ClassicBlog } from "./ClassicBlog";
import { ClassicLanding } from "./ClassicLanding";

export const TEMPLATE_REGISTRY = {
  "band-landing": BandLanding,
  "charity-landing": CharityLanding,
  "classic-blog": ClassicBlog,
  "modern-landing": ClassicLanding,
};
// export const TEMPLATE_REGISTRY = {
//   "band-landing": BandLanding,
//   "charity-landing": CharityLanding,
//   "classic-blog": ClassicBlog,
//   "modern-landing": ClassicLanding,
// } as {
//   [key: string]: React.FC<unknown>;
// };
