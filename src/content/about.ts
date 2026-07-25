import { avatars } from "@/content/avatars";

export interface AboutPhoto {
  /** Image path under `public/`. Omit to render a surface placeholder. */
  src?: string;
  alt: string;
}

/** Hero collage tile — `wide` ≈ 416×200, `square` ≈ 200×200 at desktop. */
export interface AboutHeroPhoto extends AboutPhoto {
  variant: "wide" | "square";
}

export interface AboutGreeting {
  /** Primary line (e.g. "Hi, I'm Jake!"). */
  primary: string;
  /** Secondary line beneath (e.g. "It's nice to meet you."). */
  secondary: string;
}

export interface AboutLede {
  /** Page title shown in the 2-col pocket (semantic `<h1>`). */
  label: string;
  body: string;
}

/**
 * Heading + body column. `photos` is a strip inside the body column; `gallery`
 * is a full-width grid below the whole row.
 */
export interface AboutProseBlock {
  type: "prose";
  heading: string;
  body: string[];
  photos?: AboutPhoto[];
  gallery?: AboutPhoto[];
}

export type AboutBlock = AboutProseBlock;

export interface AboutContent {
  greeting: AboutGreeting;
  heroPhotos: AboutHeroPhoto[];
  lede: AboutLede;
  blocks: AboutBlock[];
}

/**
 * About page content (v3 layout). Edit copy and images here — page components
 * stay content-agnostic.
 */
export const about: AboutContent = {
  greeting: {
    primary: "Hi, I'm Jake!",
    secondary: "It's nice to meet you.",
  },
  heroPhotos: [
    {
      src: "/avatar/jake-1-wide.webp",
      alt: "Jake Villaseñor",
      variant: "wide",
    },
    { ...avatars[2], variant: "square", alt: "" },
    { ...avatars[1], variant: "square", alt: "" },
    {
      src: "/avatar/jake-4-wide.webp",
      alt: "",
      variant: "wide",
    },
  ],
  lede: {
    label: "About",
    body: "I'm a designer, systems-thinker, and strategist that specializes in untangling messy workflows so people can get on with their day better and faster. Currently designing and building internal developer tools to reduce friction in dashboard production at StepStone Group.",
  },
  blocks: [
    {
      type: "prose",
      heading: "Biography",
      body: [
        "I've always been drawn to digital experiences that make life feel a little smoother and keep people connected long before I even considered design as a career.", 
        "That curiosity led me to study human-computer interaction at UC San Diego, where I learned to look under the hood of how people interact with technology and how we can apply design principles to make those experiences better.",
        "My work aims to strike a balance between empathy, logic, and innovation. I believe every good solution starts with listening to the people you're designing for and deeply understanding their frustrations. I view problems as puzzles to be solved, and use constraints as a means to a solution that brings value to everyone involved.",
      ],
    },
    {
      type: "prose",
      heading: "What I've been up to recently",
      body: [
        "I'm currently leading dashboard standardization initiatives and building internal developer tools to reduce friction in dashboard production and improve visual consistency at StepStone Group.",
        "Outside of my 9 to 5, I like to stay connected with my Triton roots and stay involved with the design and product communities at UC San Diego that helped me grow as a designer and as a person. You might find me speaking at panels, giving my two cents on projects, or helping student designers find their footing.",
      ],
      photos: [
        {
          src: "/photos/dfa-ux-panel.webp",
          alt: "Design for America UX Panel",
        },
        {
          src: "/photos/ps-design-dinner.webp",
          alt: "Dinner with Product Space's design vertical",
        },
        {
          src: "/photos/jake-speaking.webp",
          alt: "Jake speaking at a design event",
        },
      ],
    },
    {
      type: "prose",
      heading: "Me, outside of design",
      body: [
        "When I'm not designing, you might find me sipping an iced lemon black tea, getting outdoors with my friends, cycling through genres of music, working out, and documenting my life on BeReal.",
      ],
      gallery: [{ alt: "" }, { alt: "" }, { alt: "" }, { alt: "" }],
    },
  ],
};
