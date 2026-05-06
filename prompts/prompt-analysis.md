# AI Használat Elemzése — Mobil Webáruház Projekt
 
**Készítette:** Benkő Bence  
**Tantárgy:** Programrendszerek fejlesztése  
**AI eszköz:** Claude (Anthropic) — claude.ai
 
---
 
## 1. Áttekintés
 
A projekt fejlesztése során Claude AI-t használtam segítségként. Mivel ez volt az első komolyabb webes projektem és előzetes JavaScript, CSS, HTML és adatbázis tapasztalatom nem volt, az AI segítsége nélkül a határidő tartása valószínűleg nem lett volna lehetséges.
 
A használat módja a következő volt: az AI generálta a kódot, én pedig elmagyaráztam, hogy mit és hogyan csinál. Ha valamit nem értettem, kérdeztem, és az AI elmagyarázta. Ezzel a módszerrel aktív tanulás zajlott a kódmásolás helyett és időt is tudtam spórolni a manuális írás elkerülése végett.
 
---
 
## 2. Melyik fázisokban használtam AI-t
 
### Tervezési fázis
Az adatmodell tervezésénél az AI segített átgondolni az entitások közötti kapcsolatokat és a foreign key függőségi sorrendet. Nem adott kész megoldást, hanem kérdésekkel vezetett rá a helyes sorrendre.
 
### Fejlesztési környezet beállítása
Az Arch Linux fejlesztői környezet beállításánál (Docker, nvm, Git, SSH kulcs GitHub-ra) az AI lépésről lépésre segített, és elmagyarázta miért szükséges minden egyes lépés.
 
### Backend fejlesztés
A backend teljes fejlesztésénél (migrációk, seed fájlok, repository / service / route rétegek, JWT autentikáció, middleware-ek) az AI írta a kódot, én magyaráztam el utána. A hibakeresésben is segített — a Docker logokból azonosítottuk együtt a problémákat.
 
### Frontend fejlesztés
A React frontend fejlesztésénél az AI generálta az összes komponenst. Mivel React-et korábban nem használtam, ez a rész teljesen új volt számomra. Az alapfogalmakat (useState, useEffect, Context API, React Router) az AI magyarázta el.
 
---
 
## 3. Jól működő promptok
 
### "Magyarázd el, mi az a middleware Express-ben"
Ez a prompt jól működött, mert konkrét kérdést tettem fel egy fogalomról. Az AI egy egyszerű analógiával magyarázta el (kérés → middleware → route handler), és rögtön kapcsolta a projekthez is.
 
### "Írj egy getUserByEmail repository függvényt, én elmagyarázom utána"
Ez a prompt nagyon jól működött. Az AI megírta a kódot, majd kérdéseket tett fel hogy ellenőrizze az értelmezésemet. Ez lett az alap munkafolyamat az egész projekten.
 
### "Docker compose up --build után ezt a hibát kapom: [hibaüzenet] — mi a probléma?"
A konkrét hibaüzenet beillesztése a promptba mindig pontos és gyors választ hozott. Az AI azonnal azonosította a problémát (pl. bcrypt hiányzó csomag, YAML indentáció hiba, helytelen relatív útvonal).
 
### "Melyik entitásoknak nincs foreign key függősége és ezért először kell létrehozni?"
Ez egy jó tervezési kérdés volt. Az AI nem adta meg rögtön a választ, hanem rétegekre bontva vezette végig a gondolkodást, ami segített megérteni a migrációs sorrendet.
 
---
 
## 4. Rosszul működő promptok
 
### "Csináld meg a frontend oldalt"
Túl általános prompt. Az AI kért pontosítást — melyik oldalt, milyen funkciókkal, milyen stílusban. Tanulság: mindig konkrét kontextust kell adni.
 
### "Miért nem működik a bejelentkezés?"
Hibaüzenet és kontextus nélkül az AI csak általános lehetséges okokat tudott felsorolni. Amikor beillesztettem a konkrét Docker log üzenetet, azonnal megtalálta a problémát. Tanulság: mindig mellékelni kell a hibaüzenetet.
 
### "Nézz utána hogy mi a különbség a VARCHAR és TEXT között PostgreSQL-ben"
Ez azért volt rossz prompt, mert az AI-nak van beépített tudása erről — nem kellett volna "utánanézést" kérni. Egyszerűbb lett volna: "Mi a különbség VARCHAR és TEXT között PostgreSQL-ben?"
 
### "Írj egy szép products oldalt, olyan mint a T-Mobile webshopja"
Ez rossz prompt volt, mert egy referencia weboldal lemásolása nem reális elvárás. Tanulság: realisztikus elvárásokat kell megfogalmazni.
 
---
 
## 5. Tanulságok
 
- **Konkrét kérdések jobbak az általánosoknál.** "Mi az a JWT payload?" sokkal jobb mint "Magyarázd el a JWT-t."
- **Hibaüzenetek mellékelése kötelező.** Kontextus nélkül az AI csak találgat.
- **Az AI nem helyettesíti a megértést.** A kód magyarázatának kötelezettsége miatt valóban megtanultam amit használok.
- **Határidő nyomás alatt az AI felgyorsítja a fejlesztést**, de a tanulási folyamatot nem lehet teljesen kihagyni — különben a hibakeresés és módosítás lehetetlen lesz.
---