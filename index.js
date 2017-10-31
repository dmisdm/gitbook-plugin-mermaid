const puppeteer = require("puppeteer");
const mainTemplate = require("./convert/converter.html");
const mermaidJs = require("!raw-loader!./convert/mermaid.min.js");
const initScript = require("!raw-loader!./initScript");
const styleCss = require("!raw-loader!./convert/style.css");
const themeCss = require("!raw-loader!./convert/theme.css");
const renderToSvg = ({ mermaidCode, css }) => {
  /* eslint-disable */
  var container = document.getElementById("container");
  var holder = document.getElementById("mermaid-holder");
  while (holder.firstChild) {
    holder.removeChild(holder.firstChild);
  }
  var el;
  var styleEl = document.createElement("style");
  styleEl.innerHTML = css;
  el = document.createElement("div");
  el.innerHTML = mermaidCode;
  el.className = "mermaid";
  holder.appendChild(styleEl);
  holder.appendChild(el);
  mermaid.init();

  return holder.outerHTML;
};

const convertMermaidCodeToSvg = async (mermaidCode, book) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(mainTemplate);
  await page.evaluate(mermaidJs);
  await page.evaluate(initScript);

  const output = await page.evaluate(renderToSvg, {
    mermaidCode,
    css: styleCss + themeCss,
    config: book.config.get("pluginsConfig.mermaid")
  });

  browser.close();
  return output;
};

module.exports = {
  blocks: {
    mermaid: {
      process: function(block) {
        return convertMermaidCodeToSvg(block.body, this);
      }
    }
  }
};
