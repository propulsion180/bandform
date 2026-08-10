const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

const isServe = process.argv.includes("--serve");

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["frontend/main.tsx"],
    outdir: "gallery-server/public/",
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

  if (isServe) {
    const { port } = await ctx.serve({ servedir: ".", port: 3000, host: "localhost" });
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
