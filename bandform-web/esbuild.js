const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const fs = require("fs");

const isServe = process.argv.includes("--serve");
const OUTDIR = "dist";

// Copy the HTML entry into the build output so `dist/` is a self-contained,
// deployable folder (index.html + bundle). The reverse proxy serves `dist/`
// as the site root, so index.html references the bundle at /main.js|/main.css.
function copyIndexHtml() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.copyFileSync("index.html", `${OUTDIR}/index.html`);
}

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["frontend/main.tsx"],
    outdir: `${OUTDIR}/`,
    bundle: true,
    minify: !isServe,
    sourcemap: isServe,
    loader: { ".ts": "tsx" },
    // Backend origin baked in at build time. Default suits local dev (frontend
    // :3000 -> backend :8080). For a same-origin reverse-proxy deployment build
    // with `BF_API_ORIGIN= pnpm build` (empty -> relative URLs); for a separate
    // backend host use `BF_API_ORIGIN=https://api.example.com pnpm build`.
    define: {
      __BF_API_ORIGIN__: JSON.stringify(process.env.BF_API_ORIGIN ?? "http://localhost:8080"),
    },
    plugins: [sassPlugin()],
  });

  copyIndexHtml();

  if (isServe) {
    // Serve `dist/` as the site root. `fallback` serves index.html for any
    // request that doesn't match a real file, so refreshing/deep-linking a
    // client-side route (e.g. /login) loads the app instead of 404ing
    // (BrowserRouter then renders the route).
    const { port } = await ctx.serve({ servedir: OUTDIR, fallback: "index.html", port: 3000, host: "localhost" });
    console.log(`⚡ Dev server running at http://localhost:${port} ⚡`);
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("⚡ Build complete! ⚡");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
