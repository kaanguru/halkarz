import * as playwright from "playwright";
import fs from "fs/promises";

const filePath = "data.json";

async function yeniArzListesi(): Promise<string> {
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://halkarz.com/");
  const yeniVeBistKodluArzListesi = await page.$eval(".halka-arz-list", (ulElm) => {
    const listElms = Array.from(ulElm.getElementsByTagName("li"));

    const newAndBistKod = listElms.filter((el) => hasClass(el, "il-new") && hasClass(el, "il-bist-kod"));

    const filterText = (elm: Element): string[] => {
      const textArray = elm.textContent?.split("\n") || [];
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
        if (hasClass(child, className) && child.textContent?.trim() !== "" && child.textContent?.trim() !== null) {
          return true;
        }
      }

      return false;
    }
  });
  const data = yeniVeBistKodluArzListesi.map((row) => ({
    kod: row[0],
    sirketAdı: row[1],
    durum: row[2],
  }));
  const jsonData = JSON.stringify(data);

  console.log("Halka Arzlar --->>>>", yeniVeBistKodluArzListesi);
  await page.waitForTimeout(300);
  await browser.close();
  return jsonData;
}

async function saveDataToFile(jsonData: string) {
  await fs.writeFile(filePath, jsonData, "utf-8");
}

async function main() {
  const data = await yeniArzListesi();
  await saveDataToFile(data);
}

// Call the main function to start the process
main().catch((error) => console.error(error));
