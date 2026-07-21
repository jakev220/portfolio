import type { AvatarImage } from "@/components/HeroAvatar";
import { avatars } from "@/content/avatars";

export interface AboutPhoto {
  /** Image path under `public/`. Omit to render a surface placeholder. */
  src?: string;
  alt: string;
}

/** Heading + paragraph stack (400 / 64 / 560 split). */
export interface AboutProseBlock {
  type: "prose";
  heading: string;
  /** One string per paragraph — order here = order on the page. */
  body: string[];
}

/** Variable-count lifestyle photo grid. */
export interface AboutLifestyleBlock {
  type: "lifestyle";
  photos: AboutPhoto[];
}

/**
 * Discriminated union of About page body blocks. Add a new `type` + component
 * when the page grows; keep the page a thin map over `blocks`.
 */
export type AboutBlock = AboutProseBlock | AboutLifestyleBlock;

export interface AboutContent {
  intro: string;
  photos: AvatarImage[];
  blocks: AboutBlock[];
}

/**
 * About page content. Edit copy and lifestyle images here — page components
 * stay content-agnostic. `photos` reuses the shared avatar frames from the hero.
 */
export const about: AboutContent = {
  intro:
    "Hey! I'm Jake, a designer captivated by the moment where something complicated finally clicks.",
  photos: avatars,
  blocks: [
    {
      type: "prose",
      heading: "Why design draws me in.",
      body: [
        "Growing up, most of my favorite things were centered around technology. From playing Pokémon on my Nintendo DS to using the internet to connect with people I never would have met in real life, I've always been drawn to the things that kept people connected and entertained without really understanding why.",
        "That changed when I took a course at UC San Diego about the impact of technology and design on cognition. Suddenly, I had a language for something I'd been experiencing my whole life.",
        "I chose design because it lets me use both sides of my brain: the empathetic one that wants to understand and support people, and the analytical one that sees their problems as puzzles to be solved and constraints as means to a solution.",
      ],
    },
    {
      type: "prose",
      heading: "What I've been up to recently.",
      body: [
        "I'm currently leading dashboard standardization initiatives and building an internal developer tool to reduce friction in dashboard production at StepStone Group.",
        "Previously, I designed an end-to-end experience for a multi-agent LLM peer-review system at ProtoLab, a research group within the UC San Diego Design Lab.",
        "Outside of the workplace, I like to give back to design and product communities at UC San Diego by speaking at panels, providing guidance on client projects, and helping student designers find their footing!",
      ],
    },
    {
      type: "prose",
      heading: "Me, outside of design.",
      body: [
        "When I'm not designing, you can find me sipping an iced lemon black tea, enjoying San Diego with my friends, cycling through genres of music, working out, and documenting my life on BeReal!",
      ],
    },
    {
      type: "lifestyle",
      // Variable-length list; omit `src` for surface placeholders until assets land.
      photos: [
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
        { alt: "" },
      ],
    },
  ],
};
