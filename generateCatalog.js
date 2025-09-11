const fs = require("fs");
const path = require("path");

const dir = "./images/waffles";
const priceFile = "./prices.json";

const files = fs.readdirSync(dir);
const prices = fs.existsSync(priceFile)
  ? JSON.parse(fs.readFileSync(priceFile, "utf8"))
  : {};

const catalog = files.map((file, index) => ({
  name: path.parse(file).name.replace(/_/g, " "), // "waffle_choco" → "waffle choco"
  price: prices[file] || 1500, // usa precio de prices.json, si no existe usa 1500
  image: dir + "/" + file
}));

fs.writeFileSync("catalog.json", JSON.stringify(catalog, null, 2));
console.log("✅ Catálogo generado con", catalog.length, "waffles");
