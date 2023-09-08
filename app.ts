import * as playwright from "playwright";

async function main() {
  const browser = await playwright.chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto("https://halkarz.com/");
  const arzListesi = await page.$eval(".halka-arz-list", (ulElm) => {
    const listElms = Array.from(ulElm.getElementsByTagName("li"));



    const newAndBistKod = listElms.filter((el) => hasClass(el, "il-new") && hasClass(el, "il-bist-kod"));

    const filterText = (elm: Element): string[] => {
      const textArray = elm.textContent?.split("\n") || []; // Use textContent
      const cleanedTextArray = textArray
        .map((text) => text.trim())
        .filter((text) => text !== "")
        .slice(1);
      return cleanedTextArray;
    };

    return newAndBistKod.map(filterText);
    function hasClass(elm: Element, className: string): boolean {
        if (elm.classList.contains(className)) {
          return true;
        }
  
        for (const child of elm.children) {
          if (hasClass(child, className) && child.textContent?.trim() !== ""  && child.textContent?.trim() !== null ) {
            return true;
          }
        }
  
        return false;
      }
  });

//   console.log("Halka Arzlar --->>>>", arzListesi.map((el) => el.shift()));
  console.log("Halka Arzlar --->>>>", arzListesi);
  await page.waitForTimeout(300); // wait
  await browser.close();
}

main();
