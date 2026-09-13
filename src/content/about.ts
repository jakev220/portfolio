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

export interface AboutExperienceEntry {
  organization: string;
  position: string;
  duration: string;
  /** Optional muted italic line (e.g. degree minor). */
  detail?: string;
  /**
   * Optional still shown in the left rail under “Journey” while hovering
   * this row (fine-pointer desktop only). Path under `/public`.
   */
  preview?: string;
  /** Alt for `preview`; defaults to the organization name. */
  previewAlt?: string;
  /**
   * How the still fills the preview frame. Use `contain` only when the asset
   * should letterbox; photos and full-bleed logo cards default to `cover`.
   */
  previewFit?: "cover" | "contain";
  /**
   * Skip Next’s image optimizer (logos / sharp graphics) so a second lossy
   * pass doesn’t soft-edge the mark.
   */
  previewUnoptimized?: boolean;
}

export interface AboutResumeSection {
  title: string;
  entries: AboutExperienceEntry[];
}

export interface AboutContent {
  greeting: AboutGreeting;
  heroPhotos: AboutHeroPhoto[];
  lede: AboutLede;
  blocks: AboutBlock[];
  /** Left-rail heading for the resume stack. */
  resumeHeading: string;
  resume: AboutResumeSection[];
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
    body: "I'm a designer, systems-thinker, and strategist that specializes in untangling messy workflows so people can get on with their day better and faster. Currently building internal developer tools to reduce friction and improve visual consistency in dashboard production at StepStone Group.",
  },
  blocks: [
    {
      type: "prose",
      heading: "Biography",
      body: [
        "I've always been drawn to digital experiences that make life feel a little smoother and keep people connected long before I even considered design as a career.", 
        "That curiosity led me to study human-computer interaction at UC San Diego, where I learned to look under the hood of how people interact with technology and how we can apply design principles to make those experiences better.",
        "My work aims to strike a balance between empathy, logic, and innovation. I believe every good solution starts with listening to the people you're designing for and deeply understanding their frustrations and what helps them accomplish their goals. I view problems as puzzles to be solved, and use constraints as a means to a solution that brings value to everyone involved.",
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
  resumeHeading: "Journey",
  resume: [
    {
      title: "Education",
      entries: [
        {
          organization: "University of California, San Diego",
          position: "B.S. Cognitive Science w/ spec. Design & Interaction (HCI)",
          detail: "Minor in Computer Science",
          duration: "Aug 2021 – Jun 2025",
          preview: "/photos/about-experience/jake-ceremony.webp",
        },
      ],
    },
    {
      title: "Experience",
      entries: [
        {
          organization: "StepStone Group",
          position: "UX/UI Design Analyst → UI/UX Designer I",
          duration: "Jun 2025 – Present",
          preview: "/photos/about-experience/ssg-logo.webp",
          previewUnoptimized: true,
        },
        {
          organization: "UC San Diego Design Lab",
          position: "UI/UX Design Intern",
          duration: "Jun 2025 – Dec 2025",
          preview: "/photos/about-experience/dlab-photo.webp",
        },
        {
          organization: "SPIN",
          position: "Product Strategy & Research Consultant",
          duration: "Apr 2025 – Jun 2025",
          preview: "/photos/about-experience/spin-title-slide.webp",
        },
        {
          organization: "Newco (Stealth)",
          position: "Contract Product Designer",
          duration: "Jul 2024 – Oct 2024",
          preview: "/photos/about-experience/stealth-logo.webp",
          previewUnoptimized: true,
        },
      ],
    },
    {
      title: "Extras",
      entries: [
        {
          organization: "Product Space at UC San Diego",
          position: "Product Design Mentor (UX Designer)",
          duration: "May 2024 – Jun 2025",
          preview: "/photos/about-experience/ps-group-photo.webp",
        },
        {
          organization: "CSE Society at UC San Diego",
          position: "VP Design (Development Branch)",
          duration: "Apr 2024 – Jun 2025",
          preview: "/photos/about-experience/cses-ceremony.webp",
        },
        {
          organization: "UC San Diego Cognitive Science Department",
          position: "Instructional Assistant",
          detail: "DSGN 100: Prototyping & COGS 187A: Usability & Information Architecture",
          duration: "Jan 2025 – Jun 2025",
          preview: "/photos/about-experience/dsgn100-team.webp",
        },
        {
          organization: "Teaching + Learning Commons at UC San Diego",
          position: "Undergraduate Writing Consultant",
          duration: "Aug 2022 – Jun 2025",
          preview: "/photos/about-experience/writing-hub-group.webp",
        },
      ],
    },
  ],
};
