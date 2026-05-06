# Mobil Webáruház — Szoftverdokumentáció
 
**Készítette:** Benkő Bence  
**Tantárgy:** Programrendszerek fejlesztése  
**Leadási határidő:** 2026. május 10.
 
---
 
## 1. A projektről
 
Ez a projekt egy mobil eszközöket árusító webáruház, amelyet az MSc képzés keretében készítettem el. A rendszer lehetővé teszi a felhasználók számára, hogy böngésszék a termékeket, kosárba tegyék azokat és megvásárolják őket. Az admin felhasználó kezelheti a termékeket, az árakat, a készletet és a rendeléseket.
 
A projektet egyedül készítettem, előzetes JavaScript és webfejlesztési tapasztalat nélkül. Ez volt az első komolyabb webes projektem, ezért bizonyos döntések mögött inkább a tanulási szempont áll, mint a production-ready megoldás.
 
---
 
## 2. Technológiai stack
 
### 2.1 Frontend — React + Vite
 
A frontendhez React-et választottam Vite fejlesztői szerverrel. A React-et azért választottam, mert komponens alapú, és rengeteg dokumentáció, tutorial érhető el hozzá. Az Angular-t is figyelembe vettem, mivel az a tananyagban szerepelt, de úgy éreztem, hogy az Angular túl sok új fogalmat hozna egyszerre (dekorátorok, modulok, dependency injection), ezért maradtam a React-nél. A Vite-ot a Create React App helyett választottam, mert azt már nem fejlesztik aktívan.
 
### 2.2 Backend — Node.js + Express
 
A backend Node.js-ben készült Express keretrendszerrel. Azért választottam ezt, mert ugyanazt a nyelvet használhatom frontend és backend oldalon is (JavaScript), és a tananyag példáiban is Express szerepelt. A CommonJS modulrendszert használom a backend oldalon, mivel az Express dokumentációk nagy része ezt használja.
 
### 2.3 Adatbázis — PostgreSQL
 
Az adatbázishoz PostgreSQL-t választottam. MongoDB-t is fontoltam, de a termékek, variánsok, rendelések és felhasználók közötti kapcsolatok miatt relációs adatbázis logikusabb megoldásnak tűnt. ORM-et (például Sequelize vagy Prisma) szándékosan nem használtam, mert szerettem volna megtanulni a nyers SQL írást. A `pg` drivert használom közvetlenül.
 
### 2.4 Konténerizáció — Docker + Docker Compose
 
Az egész rendszer Docker konténerekben fut. Három konténer van: frontend, backend és adatbázis. A Docker Compose biztosítja, hogy bármely gépen ugyanúgy fusson a rendszer, nem kell külön telepíteni Node.js-t vagy PostgreSQL-t.
 
### 2.5 Hitelesítés — JWT + bcrypt
 
A felhasználók azonosítására JWT (JSON Web Token) tokeneket használok. Bejelentkezéskor a szerver kiad egy tokent, amit a kliens minden védett kérésnél elküld az Authorization headerben. A jelszavakat bcrypt-tel hasheltem, 10-es cost factorral.
 
---
 
## 3. Funkcionális követelmények
 
### 3.1 Felhasználói szerepkörök
 
A rendszerben háromféle felhasználó létezik:
 
- **Vendég (Vendég):** Regisztráció nélkül böngészhet a termékek között, megtekintheti az árakat és a készletet, de nem tud vásárolni.
- **Vásárló (Customer):** Regisztrált felhasználó, aki termékeket tehet a kosarába és megvásárolhatja azokat.
- **Admin:** Kezelheti a termékeket, árakat, készletet és rendeléseket.
### 3.2 Megvalósított funkciók
 
**Regisztráció és bejelentkezés**
- Új felhasználó regisztrálhat email cím és jelszó megadásával
- Bejelentkezés után JWT token kerül kiadásra
- Regisztrációkor automatikusan létrejön a felhasználó kosara
**Termékböngészés**
- Az összes termék listázható márka szerint szűrve
- Minden termékhez megjelennek a variánsok (szín, méret, tárhely, ár, készlet)
- Termék részletező oldal leírással és variáns választóval
**Kosár kezelése**
- Termék hozzáadása kosárhoz (készlet ellenőrzéssel)
- Mennyiség módosítása
- Termék eltávolítása
- Ha egy termékből már van a kosárban, a mennyiség összeadódik
**Rendelés leadása**
- A kosár tartalmából rendelés hozható létre szállítási adatok megadásával
- Rendelés leadásakor az ár pillanatképe eltárolódik (price snapshot)
- Rendelés után a kosár automatikusan törlődik, a készlet csökken
- Az egész folyamat adatbázis tranzakcióban fut
**Rendelés előzmények**
- A bejelentkezett felhasználó megtekintheti korábbi rendeléseit
**Admin panel**
- Összes rendelés megtekintése (felhasználói adatokkal együtt)
- Rendelés státusz frissítése (pending → processing → shipped → delivered → cancelled)
- Termék hozzáadása, módosítása, törlése
- Variáns árának módosítása
- Készlet frissítése
### 3.3 REST API végpontok
 
A rendszer REST API-t biztosít a következő végpontokkal:
 
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| POST | `/api/users/register` | Regisztráció |
| POST | `/api/users/login` | Bejelentkezés |
| GET | `/api/users/me` | Aktuális felhasználó |
| GET | `/api/products` | Összes termék |
| GET | `/api/products/:id` | Termék részletek |
| GET | `/api/cart` | Kosár megtekintése |
| POST | `/api/cart/items` | Termék kosárba |
| PUT | `/api/cart/items/:id` | Mennyiség módosítás |
| DELETE | `/api/cart/items/:id` | Termék eltávolítása |
| POST | `/api/orders` | Rendelés leadása |
| GET | `/api/orders` | Rendelés előzmények |
| GET | `/api/admin/orders` | Összes rendelés (admin) |
| PUT | `/api/admin/orders/:id/status` | Státusz módosítás |
| POST | `/api/admin/products` | Termék létrehozása |
| PUT | `/api/admin/products/:id` | Termék módosítása |
| DELETE | `/api/admin/products/:id` | Termék törlése |
| PUT | `/api/admin/variants/:id` | Ár módosítása |
| PUT | `/api/admin/stock/:id` | Készlet módosítása |
 
---
 
## 4. Adatmodell
 
Az adatbázis 13 entitást tartalmaz, amelyek lefedik az összes szükséges funkciót.
 
### 4.1 Entitások
 
| Entitás | Leírás |
|---------|--------|
| users | Felhasználók (vásárlók és adminok) |
| makes | Gyártók (Samsung, Apple, stb.) |
| lines | Termékcsaládok (Galaxy S sorozat, stb.) |
| products | Alaptermékek |
| product_variants | Konkrét vásárolható variánsok (szín + méret + tárhely) |
| colors | Színek listája |
| sizes | Képernyőméretek listája |
| storages | Tárolókapacitás lista |
| inventory_stocks | Készlet variánsonként |
| carts | Kosarak (felhasználónként egy) |
| cart_items | Kosár tételek |
| orders | Rendelések |
| order_items | Rendelés tételek |
 
### 4.2 Kapcsolatok
 
```
User ──────────── Cart          (Egy az egyhez)
User ──────────── Order         (Egy a többhöz)
Make ──────────── Line          (Egy a többhöz)
Line ──────────── Product       (Egy a többhöz)
Product ────────── ProductVariant (Egy a többhöz)
ProductVariant ─── InventoryStock (Egy az egyhez)
ProductVariant ─── CartItem      (Egy a többhöz)
ProductVariant ─── OrderItem     (Egy a többhöz)
Cart ───────────── CartItem      (Egy a többhöz)
Order ──────────── OrderItem     (Egy a többhöz)
```
 
### 4.3 Fontosabb tervezési döntések
 
**Ár pillanatkép (price snapshot)**
A rendelés tételeknél az ár a rendelés pillanatában kerül eltárolásra, nem idegen kulcsként hivatkozik a termék árára. Ha az ár később megváltozik, a régi rendelés megőrzi az eredeti árat.
 
**Normalizált attribútumok**
A szín, méret és tárolókapacitás külön táblákban van tárolva. Ez elkerüli a szöveg duplikációt és következetességet biztosít.
 
**Szerepkör enum-ként**
A felhasználói szerepkör `customer | admin` enum típusú mező, nem boolean `is_admin` flag. Ez rugalmasabb, ha a jövőben új szerepkört kellene hozzáadni.
 
---
 
## 5. Nem-funkcionális követelmények
 
### 5.1 Biztonság
 
**Jelszókezelés**
A jelszavak bcrypt-tel hasheltek, 10-es cost factorral tárolódnak az adatbázisban. Soha nem kerül plain text jelszó eltárolásra.
 
**Hitelesítés**
JWT tokenek 24 órás lejárati idővel. Minden védett végpont ellenőrzi a token érvényességét egy middleware segítségével.
 
**Jogosultságkezelés**
Role-based access control (RBAC) van implementálva. Az admin végpontokat csak admin szerepkörű felhasználók érhetik el, ezt egy dedikált middleware ellenőrzi.
 
**SQL injection védelem**
Minden adatbázis lekérdezés paraméteres (`$1`, `$2` placeholderekkel), soha nem kerül felhasználói input közvetlenül a lekérdezésbe.
 
**Információszivárgás megelőzése**
A szerver csak generikus hibaüzeneteket küld vissza a kliensnek. A részletes hibaüzenetek csak a szerver naplóban jelennek meg.
 
**Ismert limitáció**
A JWT token a böngésző `localStorage`-ában kerül tárolásra, ami XSS támadásokkal szemben sebezhető. Egy production rendszerben `httpOnly` cookie-t kellene használni.
 
### 5.2 Adatintegritás
 
Az adatbázis szintjén `CHECK` constraint-ek biztosítják, hogy a készlet és mennyiség soha ne legyen negatív. A rendelés leadása adatbázis tranzakcióban fut — ha bármelyik lépés meghiúsul, az egész visszagörget.
 
### 5.3 Reprodukálhatóság
 
A teljes rendszer egyetlen `docker compose up --build` paranccsal elindítható bármely gépen, ahol Docker telepítve van. A migrációs fájlok automatikusan lefutnak az adatbázis első indításakor, a seed fájlok demo adatokkal töltik fel.
 
### 5.4 Karbantarthatóság
 
A backend háromrétegű architektúrán alapul (routes / services / repositories), ami biztosítja, hogy az egyes rétegek felelősségi körei jól elkülönülnek. Az adatbázis réteg cseréje esetén csak a repository fájlokat kellene módosítani.
 
---
 
## 6. Ismert korlátok és jövőbeli fejlesztési lehetőségek
 
- **Képek hiánya:** A termékekhez nem lehet képet feltölteni. Egy jövőbeli verzióban file upload és cloud storage (pl. AWS S3) megoldhatná ezt.
- **Kosár lejárat:** Az inaktív kosarak törlése alkalmazás szinten van kezelve, nem ütemezett feladattal. Production környezetben job scheduler (pl. pg-cron) lenne a megfelelő megoldás.
- **Felhasználói cím:** A szállítási cím flat mezőkként van tárolva a felhasználón. Egy komolyabb rendszerben külön Address entitás lenne, több cím tárolásának lehetőségével.
- **Egységes Dockerfile:** Nincs külön fejlesztői és production Dockerfile. Egy éles rendszerben ez szükséges lenne.
- **Termék keresés:** Jelenleg csak márka szerint lehet szűrni. Szöveges keresés még nincs implementálva.
---