import { describe, it, expect } from "vitest";
import { parseCsv, validateSeed } from "./seed";

const HEAD = "title,creator_name,tools,commercial_ok,category,filename";
const exists = (f: string) => f !== "missing.webp";

describe("seed csv", () => {
  it("parses quoted fields, commas and CRLF", () => {
    expect(parseCsv('a,"b, c",d\r\n"e ""q""",f,g\n')).toEqual([["a", "b, c", "d"], ['e "q"', "f", "g"]]);
  });

  it("accepts a valid file with optional creator columns", () => {
    const r = validateSeed(`${HEAD},portfolio_url,contact_email\nSky,Ann,Flux,true,landscape,a.webp,https://ann.example/p,ann@example.com\nSea,Bo,,false,,b.webp,,`, exists);
    expect(r.errors).toEqual([]);
    expect(r.rows[0]).toMatchObject({ commercial_ok: true, portfolio_url: "https://ann.example/p", contact_email: "ann@example.com" });
    expect(r.rows[1]).toMatchObject({ tools: null, category: null, portfolio_url: null, contact_email: null });
  });

  it("works without the optional columns", () => {
    expect(validateSeed(`${HEAD}\nSky,Ann,Flux,true,landscape,a.webp`, exists).errors).toEqual([]);
  });

  it("reports every problem with its line number", () => {
    const r = validateSeed(`${HEAD},portfolio_url,contact_email\n,Ann,,maybe,,a.png,,\nX,Bo,,true,,missing.webp,javascript:alert(1),nope\nY,Cy,,true,,a2.webp,,\nZ,Di,,true,,a2.webp,,`, exists);
    expect(r.errors).toEqual(expect.arrayContaining([
      "line 2: title is required", "line 2: a.png must be a .webp file", "line 2: commercial_ok must be true or false",
      "line 3: file not found: missing.webp", "line 3: portfolio_url must start with http:// or https://",
      "line 3: contact_email is not an email address", "line 5: duplicate filename a2.webp",
    ]));
  });

  it("rejects a file with missing required columns", () => {
    expect(validateSeed("title,filename\nA,a.webp", exists).errors).toContain("missing column: creator_name");
  });
});
