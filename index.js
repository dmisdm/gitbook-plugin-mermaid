const puppeteer = require("puppeteer");
const mainTemplate = require("./convert/converter.html");
const mermaidJs = require("!raw-loader!mermaid/dist/mermaid.min.js");
const initScript = require("!raw-loader!./initScript");

const renderToSvg = mermaidCode => {
  /* eslint-disable */
  var container = document.getElementById("container");
  var holder = document.getElementById("mermaid-holder");
  while (holder.firstChild) {
    holder.removeChild(holder.firstChild);
  }
  var el;
  el = document.createElement("div");
  el.innerHTML = mermaidCode;
  el.className = "mermaid";
  holder.appendChild(el);
  mermaid.init();
  var xmlSerializer = new XMLSerializer();
  svgValue = xmlSerializer.serializeToString(container);

  return svgValue;
};

const convertMermaidCodeToSvg = async mermaidCode => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(mainTemplate);
  await page.evaluate(mermaidJs);
  await page.evaluate(initScript);
  const output = await page.evaluate(renderToSvg, mermaidCode);
  browser.close();
  return output;
};

module.exports = {
  blocks: {
    mermaid: {
      process: async block => convertMermaidCodeToSvg(block.body)
    }
  }
};
