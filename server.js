// Promo links feature (preview)
// live demo trigger
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: false }));

const events = [
  {
    id: "harbor-jazz",
    name: "Harbor Jazz Night",
    date: "Fri, Oct 16",
    venue: "Pier 4 Warehouse",
    price: "$42",
    blurb: "A quartet on the water. Two sets.",
  },
  {
    id: "city-10k",
    name: "City 10K",
    date: "Sun, Oct 18",
    venue: "Riverside Park",
    price: "$35",
    blurb: "Flat course, early start, finisher medal.",
  },
  {
    id: "film-night",
    name: "After Hours Film",
    date: "Sat, Oct 24",
    venue: "The Lantern",
    price: "$18",
    blurb: "One feature, one short, talk after.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)} · Row Nine</title>
  <style>
    body { font: 16px/1.5 Georgia, serif; margin: 2rem auto; max-width: 38rem; color: #1c1917; }
    a { color: #9a3412; }
    header { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
    nav { font-size: 0.95rem; }
    h1 { font-size: 1.6rem; margin: 1.2rem 0 0.4rem; }
    .muted { color: #57534e; }
    .card { border-top: 1px solid #e7e5e4; padding: 0.75rem 0; }
    .banner { background: #ffedd5; padding: 0.55rem 0.75rem; }
    input, button { font: inherit; padding: 0.3rem 0.45rem; }
  </style>
</head>
<body>
  <header>
    <strong><a href="/">Row Nine</a></strong>
    <nav><a href="/search">Search</a> · <a href="/promo">Promos</a> · <a href="/login">Sign in</a></nav>
  </header>
  ${body}
</body>
</html>`;
}

// Only same-site paths. Reject protocol-relative and backslash tricks.
function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.includes("\\") || value.includes("://")) return "/";
  return value;
}

app.get("/", (req, res) => {
  const cards = events
    .map(
      (event) => `<article class="card">
        <h2><a href="/events/${event.id}">${escapeHtml(event.name)}</a></h2>
        <p class="muted">${escapeHtml(event.date)} · ${escapeHtml(event.venue)} · ${escapeHtml(event.price)}</p>
      </article>`
    )
    .join("");
  res.type("html").send(
    layout(
      "Events",
      `<h1>On sale</h1>
       <p class="muted"><a href="/promo">Weekend promo</a> · codes and partner offers.</p>
       ${cards}`
    )
  );
});

app.get("/events/:id", (req, res) => {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) {
    res.status(404).type("html").send(layout("Not found", "<h1>No such event</h1>"));
    return;
  }
  res.type("html").send(
    layout(
      event.name,
      `<h1>${escapeHtml(event.name)}</h1>
       <p class="muted">${escapeHtml(event.date)} · ${escapeHtml(event.venue)}</p>
       <p>${escapeHtml(event.blurb)}</p>
       <p>${escapeHtml(event.price)}</p>
       <p><a href="/login?next=/events/${event.id}">Sign in to buy</a></p>`
    )
  );
});

app.get("/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const matches = events.filter((event) =>
    `${event.name} ${event.venue} ${event.blurb}`.toLowerCase().includes(q.toLowerCase())
  );
  const items = matches.length
    ? matches
        .map((event) => `<li><a href="/events/${event.id}">${escapeHtml(event.name)}</a></li>`)
        .join("")
    : "<li>No matches</li>";
  res.type("html").send(
    layout(
      "Search",
      `<h1>Search</h1>
       <form>
         <input name="q" value="${escapeHtml(q)}" placeholder="Jazz, park, film">
         <button>Search</button>
       </form>
       ${q ? `<p class="muted">Results for ${escapeHtml(q)}</p>` : ""}
       <ul>${items}</ul>`
    )
  );
});

app.get("/login", (req, res) => {
  const next = safeNext(req.query.next);
  res.type("html").send(
    layout(
      "Sign in",
      `<h1>Sign in</h1>
       <form method="post" action="/login">
         <input type="hidden" name="next" value="${escapeHtml(next)}">
         <p><input name="email" type="email" placeholder="you@example.com" required></p>
         <button>Continue</button>
       </form>`
    )
  );
});

app.post("/login", (req, res) => {
  res.redirect(safeNext(req.body.next));
});

// rehearsal retrigger 3
app.get("/promo", (req, res) => {
  const message =
    typeof req.query.message === "string"
      ? req.query.message
      : "Early bird pricing ends Sunday.";
  const code = typeof req.query.code === "string" ? req.query.code : "EARLYBIRD";
  const next =
    typeof req.query.next === "string" && req.query.next
      ? req.query.next
      : "https://example.com/offers/early-bird";
  res.type("html").send(
    layout(
      "Promo",
      `<h1>Promo</h1>
       <form action="/promo">
         <input name="message" value="${escapeHtml(message)}" placeholder="Banner copy">
         <input name="code" value="${escapeHtml(code)}" placeholder="Code">
         <button>Preview</button>
       </form>
       <p class="banner">${message}</p>
       <p>Use code <strong>${escapeHtml(code)}</strong> at checkout.</p>
       <p><a href="/go?next=${encodeURIComponent(next)}">Continue to offer</a></p>`
    )
  );
});

app.get("/go", (req, res) => {
  const next =
    typeof req.query.next === "string" && req.query.next ? req.query.next : "/";
  res.redirect(next);
});

app.use((req, res) => {
  res.status(404).type("html").send(layout("Not found", "<h1>Not found</h1>"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Row Nine listening on http://localhost:${port}`);
});
