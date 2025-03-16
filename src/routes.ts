import { createPlaywrightRouter } from "crawlee";
// import "./definitions/cleaner.js";
// import STOPWORDS from "./resources/stopwords.json";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ waitForSelector, parseWithCheerio, enqueueLinks }) => {
  await waitForSelector("a.a-link-normal.s-no-outline");
  const $ = await parseWithCheerio();
  const urls = $("a.a-link-normal.s-no-outline")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter((el) => !el.startsWith("/ssa/click"));
  await enqueueLinks({
    baseUrl: "https://www.amazon.com",
    urls,
    label: "detail",
  });
});

router.addHandler("detail", async ({ waitForSelector, parseWithCheerio, request, log, pushData }) => {
  await waitForSelector("ul.a-unordered-list.a-horizontal.a-size-small");
  const $ = await parseWithCheerio();

  const title = $("#productTitle").text();

  const tags = $("ul.a-unordered-list.a-horizontal.a-size-small")
    .find("a.a-link-normal.a-color-tertiary")
    .map((_, el) => $(el).text())
    .get();

  const image = $("#landingImage").attr("src");
  const description: string[] = [];

  // #feature-bullets
  const featureBullet = $("ul.a-unordered-list.a-vertical.a-spacing-small")
    .find("span")
    .map((_, el) => $(el).text())
    .get();

  description.push(...featureBullet);

  // #productDescription_feature_div
  const productDescription = $("div#productDescription_feature_div")
    .find("span")
    .map((_, el) => $(el).text())
    .get();

  description.push(...productDescription);

  log.info("Done with title: " + title);
  pushData({
    title,
    url: request.loadedUrl,
    tags,
    image,
    description,
  });
});
