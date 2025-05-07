[...document.querySelectorAll("main .card")].map((card) => {
  const presentations = [...card.querySelectorAll(".card-body .row")].map((row) => {
    const rawHTML = row.querySelector(".col-md-12")?.innerHTML || "";

    const universityMap = {};
    [...rawHTML.matchAll(/<small><sup>(\d+)<\/sup>(.*?)<\/small>/g)].forEach(m =>
      universityMap[m[1]] = m[2].trim()
    );

    const authors = [];
    const blockMatch = rawHTML.match(/<strong>Authors:<\/strong>([\s\S]*?)<br>/i);
    if (blockMatch) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = blockMatch[1];

      let currentAuthor = null;

      Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeName === "#text" || node.nodeName === "U") {
          node.textContent.replace(/;/g, '').split(",").map(n => n.trim()).filter(Boolean).forEach(name => {
            currentAuthor = { author: name.toLocaleLowerCase().replace(/\b\w/g, char => char.toUpperCase()), universities: [] };
            authors.push(currentAuthor);
          });
        }

        if (node.nodeName === "SUP" && currentAuthor) {
          node.textContent.split(",").forEach(sup => {
            const uni = universityMap[sup.trim()] || "(Unknown)";
            if (!currentAuthor.universities.includes(uni)) {
              currentAuthor.universities.push(uni);
            }
          });
        }
      });
    }

    return {
      title: row.querySelector("h4 a")?.textContent.trim() || "",
      abstract: row.querySelector("h4 a")?.href || "",
      field: (rawHTML.match(/<strong>Track:\s*<\/strong>\s*(.*?)<br>/i)?.[1] || "").trim(),
      presentedBy: (rawHTML.match(/<strong>Speaker:<\/strong>\s*(.*?)<br>/i)?.[1] || "").trim(),
      authors,
      hour: row.querySelector("h3 > span")?.textContent.replaceAll("\n", "").trim().replaceAll(":", "h") || "",
      id: row.querySelector("h3 a")?.textContent.trim() || "",
    };
  }).filter(p => p.id);

  const headers = card.querySelectorAll(".card-header h4");
  const datetime = (headers[0]?.textContent || "").split("(")[1]?.replace(")", "").trim().split(" ");

  if (!datetime) return {};

  return {
    session: (headers[0]?.textContent || "").split("(")[0]?.trim().replace("Session ", "") || "",
    date: "2025/" + datetime[0],
    time: datetime[1].replaceAll(":", "h"),
    location: headers[1]?.textContent.replace("Place: ", "").trim().replaceAll("1o ", "1º ") || "",
    presentations
  };
}).filter(s => s.session);