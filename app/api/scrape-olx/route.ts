import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

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

// Helper pentru a curăța textul de spații inutile
function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
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

    // Folosim un User-Agent real pentru a nu fi blocați de OLX
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

    // --- 1. TITLU, PREȚ, DESCRIERE ---
    // Meta tag-urile sunt cele mai sigure surse (nu se schimbă des)
    const metaTitle = $('meta[property="og:title"]').attr("content") || "";
    const title =
      metaTitle.split(" - ")[0] ||
      $("h1").text().trim() ||
      "Titlu indisponibil";

    // Descriere: combinăm meta description cu textul din div-ul principal
    const metaDesc = $('meta[property="og:description"]').attr("content") || "";
    const descriptionDiv =
      $('div[data-cy="ad_description"] div').text() ||
      $('div[class*="css-bgzo2k"]').text();
    const description = cleanText(descriptionDiv || metaDesc);

    // Preț: Căutăm containerul specific de preț
    let price = "Preț nespecificat";
    const priceElement = $('[data-testid="ad-price-container"] h3').text();
    if (priceElement) {
      price = cleanText(priceElement);
    }

    // --- 2. LOCAȚIE ---
    // OLX pune locația de obicei sub titlu sau în sidebar. Căutăm elemente care conțin textul specific locațiilor (cu virgulă)
    let location = "";
    // Încercăm să găsim un paragraf care conține o locație (ex: "Bucuresti, Sector 1")
    const locationDiv = $("p")
      .filter((_, el) => {
        const t = $(el).text().trim();
        // Verificare simplă: are virgulă și pare a fi o locație (nu foarte lungă)
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
    } else {
      // Fallback: luăm din zona de "Locatie" sidebar dacă există
      location = "România";
    }

    // --- 3. SPECIFICAȚII TEHNICE (Model, Putere, etc.) ---
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

    // Strategie Robustă: Iterăm prin toate elementele de listă (li) sau paragrafe (p) din zona de detalii
    // și căutăm cheile specifice ("Model", "Putere", etc.)
    const allListItems = $('ul li, div[class*="css-"] p');

    allListItems.each((_, el) => {
      const text = $(el).text();
      const lowerText = text.toLowerCase();

      // Funcție helper pentru a extrage valoarea după ":" sau curățând numele cheii
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

    // Fallback Regex pentru specificații critice (An, KM) dacă nu au fost găsite în listă
    const bodyText = $("body").text();
    if (!specs.year) {
      const yearMatch = bodyText.match(/\b(19\d{2}|20\d{2})\b/);
      if (yearMatch) specs.year = yearMatch[0];
    }
    if (!specs.mileage) {
      const kmMatch = bodyText.match(/(\d+[\s.]?\d*)\s*km/i);
      if (kmMatch) specs.mileage = kmMatch[0];
    }

    // --- 4. TELEFON ---
    // Căutăm în descriere folosind Regex (OLX ascunde numărul din header în spatele unui buton)
    let phoneNumber = "";
    const phoneRegex = /(?:\+40|0)\s?7\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g;
    const phoneMatches = description.match(phoneRegex);
    if (phoneMatches) {
      phoneNumber = phoneMatches[0];
    }

    // --- 5. IMAGINI ---
    const images: string[] = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src");
      // Filtrăm doar imaginile reale din CDN-ul OLX
      if (
        src &&
        src.includes("olxcdn.com") &&
        !src.includes("user_image") &&
        !src.includes("icon")
      ) {
        images.push(src.split(";")[0]); // Luăm rezoluția maximă
      }
    });

    const carData: CarData = {
      title,
      price,
      location,
      specs,
      description,
      images: [...new Set(images)].slice(0, 8), // Maxim 8 imagini unice
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
