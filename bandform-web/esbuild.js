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
