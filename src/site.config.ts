/**
 * Deploy target configuration.
 *
 * This is the ONE place to change when the domain is decided.
 *
 *   GitHub Pages, project site (nthankas.github.io/portfolio):
 *     site: 'https://nthankas.github.io', base: '/portfolio'
 *
 *   GitHub Pages, user site (nthankas.github.io):
 *     site: 'https://nthankas.github.io', base: '/'
 *
 *   Custom domain (example.com), on Pages or Vercel:
 *     site: 'https://example.com', base: '/'
 *
 * Everything else (sitemap, canonical URLs, Open Graph URLs, asset paths,
 * the CNAME file emitted by the deploy workflow) derives from these two values.
 */
export const deploy = {
  site: 'https://nthankas.github.io',
  base: '/portfolio',
  /**
   * Set to a bare hostname (e.g. 'nikhilthankasala.com') to emit a CNAME file
   * during the Pages deploy. Leave null while the domain is undecided.
   */
  customDomain: null as string | null,
};

export interface Owner {
  name: string;
  location: string;
  email: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  /** Headshot filename under `public/`, or null to omit the photo box. */
  photo: string | null;
}

export const owner: Owner = {
  name: 'Nikhil Thankasala',
  location: 'San Francisco Bay Area, CA',
  email: 'nikhilthankasala@gmail.com',
  github: 'nthankas',
  githubUrl: 'https://github.com/nthankas',
  linkedin: 'nikhil-thankasala',
  linkedinUrl: 'https://www.linkedin.com/in/nikhil-thankasala',
  photo: 'headshot.jpg',
};

/**
 * Resume.
 *
 * Set `file` to a filename under `public/` (e.g. 'nikhil-thankasala-resume.pdf')
 * once the version to publish is chosen. Until then every resume link on the
 * site resolves to email instead, so no link is ever dead and no stub page is
 * rendered.
 */
export const resume: { file: string | null; label: string } = {
  file: 'nikhil-thankasala-resume.pdf',
  label: 'Resume',
};

export const siteMeta = {
  title: 'Nikhil Thankasala',
  role: 'Robotics software engineer',
  description:
    'Robotics software engineer working on software architecture, simulation, and perception. Senior design technical lead on a tokamak inspection robot; recently a robotics software intern at Charge Robotics and Ambi Robotics.',
};
