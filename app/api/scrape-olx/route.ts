import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const REGEX_PATTERNS = {
  // Spatii
  whitespace: /\s+/g,

  // An: 1900 - 2099
  year: /\b(19\d{2}|20\d{2})\b/,

  // Kilometri: 100.000 km, 100 000 km, 100000km
  mileage: /(\d[\d\s.]*)\s*(?:km|kilometri)/i,

  // Putere: 150 CP, 150 hp, 150 cai
  power: /(\d{2,4})\s*(?:cp|hp|cai|kw)/i,

  // Motor: 1995 cm3, 2.0 l, 2000 cc
  engine: /(\d{3,5}\s*(?:cm3|cmc|cc)|\d(?:\.\d)?\s*(?:l|litri))/i,

  // Combustibil: cuvinte cheie
  fuel: /(benzina|diesel|motorina|hibrid|hybrid|electric|gpl)/i,

  // Transmisie: automata sau manuala
  transmission: /(automata|manuala|robotizata|dsg)/i,

  // Telefon: +40, 07xx
  phone: /(?:\+40|0)\s?7\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g,
};

export interface CarSpecs {
  model: string;
  power: string;
  bodyType: string;
  color: string;
  year: string;
  mileage: string;
  fuel: string;
  engine: string;
  transmission: string;
}

export interface CarData {
  title: string;
  price: string;
  location: string;
  specs: CarSpecs;
  description: string;
  images: string[];
  phoneNumber: string;
}

function cleanText(text: string): string {
  return text.replace(REGEX_PATTERNS.whitespace, " ").trim();
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("olx.ro")) {
      return NextResponse.json(
        { error: "Te rugăm să introduci un link valid de OLX.ro" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!response.ok)
      throw new Error(`Eroare la accesarea paginii: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const metaTitle = $('meta[property="og:title"]').attr("content") || "";
    const title =
      metaTitle.split(" - ")[0] ||
      $("h1").text().trim() ||
      "Titlu indisponibil";

    const metaDesc = $('meta[property="og:description"]').attr("content") || "";
    const descriptionDiv =
      $('div[data-cy="ad_description"] div').text() ||
      $('div[class*="css-bgzo2k"]').text();
    const description = cleanText(descriptionDiv || metaDesc);

    let price = "Preț nespecificat";
    const priceElement = $('[data-testid="ad-price-container"] h3').text();
    if (priceElement) {
      price = cleanText(priceElement);
    }

    let location = "România";
    const locationDiv = $("p")
      .filter((_, el) => {
        const t = $(el).text().trim();
        return (
          t.includes(",") &&
          t.length < 50 &&
          !t.includes("RON") &&
          !t.includes("EUR")
        );
      })
      .first();

    if (locationDiv.length) {
      location = locationDiv.text().trim();
    }

    const specs: CarSpecs = {
      model: "",
      power: "",
      bodyType: "",
      color: "",
      year: "",
      mileage: "",
      fuel: "",
      engine: "",
      transmission: "",
    };

    const allListItems = $('ul li, div[class*="css-"] p');

    allListItems.each((_, el) => {
      const text = $(el).text();
      const lowerText = text.toLowerCase();
      const extractVal = (key: string) =>
        cleanText(text.replace(new RegExp(key + ":?", "i"), ""));

      if (lowerText.includes("model")) specs.model = extractVal("model");
      else if (lowerText.includes("putere")) specs.power = extractVal("putere");
      else if (lowerText.includes("caroserie"))
        specs.bodyType = extractVal("caroserie");
      else if (lowerText.includes("culoare"))
        specs.color = extractVal("culoare");
      else if (
        lowerText.includes("an de fabricatie") ||
        lowerText.includes("anul")
      )
        specs.year = extractVal("an de fabricatie");
      else if (lowerText.includes("rulaj")) specs.mileage = extractVal("rulaj");
      else if (lowerText.includes("combustibil"))
        specs.fuel = extractVal("combustibil");
      else if (lowerText.includes("capacitate motor"))
        specs.engine = extractVal("capacitate motor");
      else if (lowerText.includes("cutie de viteze"))
        specs.transmission = extractVal("cutie de viteze");
    });

    const bodyText = $("body").text();
    const fullTextSearch = title + " " + description + " " + bodyText;

    // 1. AN
    if (!specs.year || specs.year.length < 4) {
      const match = fullTextSearch.match(REGEX_PATTERNS.year);
      if (match) specs.year = match[0];
    }

    // 2. RULAJ / KM
    if (!specs.mileage) {
      const match = fullTextSearch.match(REGEX_PATTERNS.mileage);
      if (match) specs.mileage = match[0]; // ex: "200.000 km"
    }

    // 3. PUTERE
    if (!specs.power) {
      const match = fullTextSearch.match(REGEX_PATTERNS.power);
      if (match) specs.power = match[0]; // ex: "150 CP"
    }

    // 4. MOTORIZARE
    if (!specs.engine) {
      const match = fullTextSearch.match(REGEX_PATTERNS.engine);
      if (match) specs.engine = match[0]; // ex: "1995 cm3"
    }

    // 5. COMBUSTIBIL
    if (!specs.fuel) {
      const match = fullTextSearch.match(REGEX_PATTERNS.fuel);
      if (match) {
        // Capitalizăm prima literă
        const f = match[0].toLowerCase();
        specs.fuel = f.charAt(0).toUpperCase() + f.slice(1);
      }
    }

    // 6. TRANSMISIE
    if (!specs.transmission) {
      const match = fullTextSearch.match(REGEX_PATTERNS.transmission);
      if (match) {
        const t = match[0].toLowerCase();
        specs.transmission = t.charAt(0).toUpperCase() + t.slice(1);
      }
    }

    // 7. TELEFON
    let phoneNumber = "";
    const phoneMatches = description.match(REGEX_PATTERNS.phone);
    if (phoneMatches) {
      phoneNumber = phoneMatches[0];
    }

    const images: string[] = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (
        src &&
        src.includes("olxcdn.com") &&
        !src.includes("user_image") &&
        !src.includes("icon")
      ) {
        images.push(src.split(";")[0]);
      }
    });

    const carData: CarData = {
      title,
      price,
      location,
      specs,
      description,
      images: [...new Set(images)].slice(0, 8),
      phoneNumber: phoneNumber || "Doar pe OLX (vezi cont)",
    };

    return NextResponse.json(carData);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      {
        error:
          "Nu am putut extrage datele. Verifică link-ul sau încearcă din nou.",
      },
      { status: 500 }
    );
  }
}
