# codenest

# CodeNest — Fullstack MVP (MERN)

CodeNest är en fullstack-applikation byggd för att göra det enkelt att organisera, spara och återanvända kodsnuttar.  
Fokus ligger på en tydlig användarupplevelse, säker inloggning och ett komplett flöde från idé → färdig MVP.

## Live

- App: https://codeinnest.netlify.app
- API: https://codenest-bbpf.onrender.com

## Varför CodeNest?

Som nyexaminerad fullstackutvecklare ville jag bygga ett projekt som visar:

- hur jag designar ett komplett flöde (auth → data → UI)
- hur jag arbetar med struktur, återanvändning och “production readiness”
- hur jag levererar en MVP med tydliga funktioner och förbättringar över tid

## Funktioner (utvalda)

- JWT-autentisering (register/login) + skyddade routes
- Skapa / redigera / ta bort snippets (CRUD)
- Taggar (med färgkodning och smarta förslag)
- Mappar för struktur och snabb överblick
- Favoritmarkering (star)
- Kod-editor med syntax highlighting (Monaco Editor)
- Markdown-beskrivningar med live preview
- Rollval vid första inloggning (onboarding-flöde)

## Tech stack

**Frontend**

- React + Vite
- React Router
- Monaco Editor
- Markdown rendering (React Markdown)

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT + REST API

**Deploy**

- Netlify (frontend)
- Render (backend)
- MongoDB Atlas (databas)

## Kort om implementationen

- Byggt med fokus på tydliga komponenter och återanvändbara UI-delar (ex. TagInput + SnippetCard)
- API-design med separata routes (auth/users/snippets/folders)
- Robust tag-rendering med “safe classes” för att undvika edge cases (ex. `node.js` → `node-js`) och konsekvent styling

## Nästa steg (för vidareutveckling)

- Sök/filter (tags, språk, kategori)
- Bättre onboarding och exempel-snippets
- Förbättrad delning (public links) + access-kontroll
- Mer testning och förbättrad felhantering

## Author

Brian Osumba
