import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import partytown from "@astrojs/partytown";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://pitcairnaviation.com/",
  integrations: [mdx(), sitemap(), tailwind(), react(), partytown()],
  output: "server",
  adapter: netlify()
});