process.env.CRAWLEE_PURGE_ON_START = "false";
import { launchOptions } from "camoufox-js";
import { PlaywrightCrawler } from "crawlee";
import { firefox } from "playwright";


import { router } from "./routes.js";

const startUrls = [
  // clothing
  {
    url: "https://www.amazon.com/s?bbn=1045024&rh=n%3A1045024%2Cp_85%3A2470955011&_encoding=UTF8&pf_rd_p=3f876d0c-13ae-4866-a405-22223ac5d364&pf_rd_r=ZDH0NM18S9BCW1Z696N7&ref=cct_cg_WL1DTSBC_2a1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?rh=n%3A2476517011%2Cp_85%3A2470955011&_encoding=UTF8&pf_rd_p=f4c6d664-1e53-4a07-9038-e85f4ec0b975&pf_rd_r=ZAGZ7WSTDVQ09C3MV4EK&ref=cct_cg_ML1SDSBC_2b1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?bbn=1045564&rh=n%3A1045564%2Cp_85%3A2470955011&_encoding=UTF8&pf_rd_p=f4c6d664-1e53-4a07-9038-e85f4ec0b975&pf_rd_r=SN04WGTG9BHDHX4G96KT&ref=cct_cg_ML1SDSBC_2c1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?rh=n%3A3455821%2Cp_85%3A2470955011&_encoding=UTF8&pf_rd_p=f4c6d664-1e53-4a07-9038-e85f4ec0b975&pf_rd_r=49ZKHKWJKC0HN1MMJF2X&ref=cct_cg_ML1SDSBC_2d1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?rh=n%3A1048188%2Cp_85%3A2470955011&_encoding=UTF8&pf_rd_p=180122f8-63ea-4a8d-ba14-87ef16de2d21&pf_rd_r=Y5F568MN9QBBKGD44JMS&ref=cct_cg_WL1DTSBC_2c1",
    size: 10,
  },

  // pets
  {
    url: "https://www.amazon.com/b/ref=s9_acss_bw_cg_cattile_2a1_w/ref=s9_acss_bw_cg_HPNEW22_2a1_w/?_encoding=UTF8&node=2975265011&pf_rd_m=ATVPDKIKX0DER&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-4&pf_rd_s=merchandised-search-6&pf_rd_t=101&pf_rd_t=101&pf_rd_i=2975241011&pf_rd_i=2975241011&ref_=cct_cg_cattile_2c1&pf_rd_p=47b450df-7c0b-49f9-8031-52d74f468acc&pf_rd_r=QJ1BDJKRVTW6CGMNAREM",
    size: 10
  },
  {
    url: "https://www.amazon.com/b/ref=s9_acss_bw_cg_static_2a1_w/?_encoding=UTF8&node=2975359011&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-4&pf_rd_t=101&pf_rd_i=2975312011&ref_=cct_cg_HPNEW22_2a1&pf_rd_p=77c305d3-73dd-4ed3-826d-b0e7bc35b155&pf_rd_r=MNTW196DNHBP9BN131KM",
    size: 10
  },
  {
    url: "https://www.amazon.com/b/ref=s9_acss_bw_cg_cattile_2c1_w/ref=s9_acss_bw_cg_HPNEW22_2c1_w/?_encoding=UTF8&node=2975296011&pf_rd_m=ATVPDKIKX0DER&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-4&pf_rd_s=merchandised-search-6&pf_rd_t=101&pf_rd_t=101&pf_rd_i=2975241011&pf_rd_i=2975241011&ref_=cct_cg_HPNEW22_3a1&pf_rd_p=77c305d3-73dd-4ed3-826d-b0e7bc35b155&pf_rd_r=V82JRM0CZKPR7H8T1CNH",
    size: 10
  },
  {
    url: "https://www.amazon.com/b/?_encoding=UTF8&ie=UTF8&node=2975243011&pf_rd_s=pets-subnav-flyout-content-2&pf_rd_t=SubnavFlyout&ref_=cct_cg_cattile_3c1&pf_rd_p=47b450df-7c0b-49f9-8031-52d74f468acc&pf_rd_r=KKH98JMA1QF4J486R2DE",
    size: 10
  },

  // software
  {
    url: "https://www.amazon.com/s?k=software",
    size: 20,
  },

  // electronics
  {
    url: "https://www.amazon.com/s?k=cellphones&crid=KKZPMKN3475W&sprefix=cellphones%2Caps%2C361&ref=nb_sb_noss_1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?k=headphones&crid=Y14BV4AGFT0Y&sprefix=headphon%2Caps%2C319&ref=nb_sb_noss_2",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?k=monitor&crid=2L4RPNJBI6NLE&sprefix=monitor%2Caps%2C309&ref=nb_sb_noss_1",
    size: 10,
  },
  {
    url: "https://www.amazon.com/s?k=smart+watch&crid=3SP67R39C2UVJ&sprefix=smart%2Caps%2C311&ref=nb_sb_ss_ts-doa-p_1_5",
    size: 15,
  },
  {
    url: "https://www.amazon.com/s?k=camera&crid=24C0VX3C1O2FJ&sprefix=camera%2Caps%2C310&ref=nb_sb_noss_1",
    size: 15,
  },

  // home & kitchen
  {
    url: "https://www.amazon.com/s?k=microwave&crid=2JDSS0LLHZEMJ&sprefix=microwa%2Caps%2C306&ref=nb_sb_noss_2",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=oven&crid=1RW192QFC9KM5&sprefix=oven%2Caps%2C301&ref=nb_sb_noss_1",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=sofa&crid=3MVTR2IQGTFBH&sprefix=sof%2Caps%2C315&ref=nb_sb_noss_2",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=desk&crid=25K54S1PUFYQE&sprefix=des%2Caps%2C317&ref=nb_sb_noss_2",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=cabinet&crid=21GCSYDNJWWLL&sprefix=cabin%2Caps%2C360&ref=nb_sb_noss_2",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=drawer+cabinet&ref=sr_nr_p_cosmo_multi_pt_3",
    size: 7,
  },
  {
    url: "https://www.amazon.com/s?k=vacuum&crid=33SI5HMR9N6OO&sprefix=vacc%2Caps%2C354&ref=nb_sb_ss_ts-doa-p_1_4",
    size: 7,
  },
];

const pagedStartUrls = startUrls.flatMap((url) => {
  console.log(url);
  return Array.from({ length: url.size }).map((_, index) => {
    if (index === 0) {
      return url.url;
    }
    return `${url.url}&page=${index + 1}`;
  });
});

const crawler = new PlaywrightCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  launchContext: {
    launcher: firefox,
    launchOptions: await launchOptions({
      headless: true,
      // Pass your own Camoufox parameters here...
      // block_images: true,
      // fonts: ['Times New Roman'],
      // ...
    }),
  },
});

console.log("pagedStartUrls: ", pagedStartUrls);
await crawler.run(pagedStartUrls, {});
