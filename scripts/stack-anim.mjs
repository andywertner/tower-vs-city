import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  defaultViewport: { width: 1280, height: 720 },
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle0" });
await page.evaluate(() => sessionStorage.clear());
await page.reload({ waitUntil: "networkidle0" });
await page.click('[data-band="34"]');
await page.click('[data-act="go"]');
for (const [item, zone] of [["trophy", "up"], ["blocks", "up"], ["table", "across"], ["houses", "across"]]) {
  await page.click(`[data-item="${item}"]`);
  await page.click(`[data-zone="${zone}"]`);
}
await page.waitForSelector('[data-choice="tower"]');
await page.screenshot({ path: "/tmp/tvc-shots/23-choice.png" });
await page.click('[data-choice="tower"]');
const tops = [];
for (const [ms, name] of [[600, "24-stack-early"], [2800, "25-stack-mid"], [4700, "26-stack-landed"]]) {
  await new Promise((r) => setTimeout(r, ms - (tops.at(-1)?.ms ?? 0)));
  const y = await page.$eval(".big-tower rect.drop", (el) => el.getBoundingClientRect().top);
  tops.push({ ms, y });
  await page.screenshot({ path: `/tmp/tvc-shots/${name}.png` });
}
console.log(JSON.stringify(tops));
if (!(tops[0].y < tops[2].y - 50)) throw new Error("brick did not move down");
await browser.close();
