# Digital Signage Raspberry Pi – Frontend 

Projekt frontendowy systemu Digital Signage przeznaczonego na Raspberry Pi.

## Opis
Repozytorium zawiera czysty Angularowy projekt z komponentami, serwisami i interceptorami.

Jest to projekt grupowy w którym jestem odpowiedzialny za front. Backend nie jest częścią tego repozytorium. Wszystkie połączenia API zostały wyłączone.

---

## Stack
- Angular 20  
- TypeScript  
- HTML / CSS / Bootstrap  
- FullCalendar
- RxJS

---

## Zakres mojej pracy
- Projektowanie i implementacja frontendowych stron i komponentów  
- Tworzenie serwisów Angularowych
- Implementacja interceptorów (`AuthInterceptor`, `ApiPrefixInterceptor`)  
- Tworzenie warstwy wizualnej przy użyciu Bootstrap + CSS

## Struktura projektu
- `src/app/components/` – wszystkie komponenty Angular odpowiedzialne za UI (header, footer, sidebar)
- `src/app/pages/` – wszystkie strony Angular odpowiedzialne za UI (dashboard, media, playlisty, agenci, grupy)
- `src/app/services/` – serwisy które zarządzają logiką biznesową i połączeniami z API
- `src/app/interceptors/` – Http interceptory, np. `AuthInterceptor` i `ApiPrefixInterceptor`
- `src/environments/` – konfiguracja środowiska (`environment.ts`)

## Strony aplikacji
- Dashboard - Pokazuje ogólne statystyki: liczniki grup, playlist, mediów wrzuconych na serwer oraz ilość urządzeń w systemie
- Media - Dodawanie, usuwanie, pobieranie, edycja oraz podgląd mediów wrzuconych na serwer
- Playlisty - Tworzenie, modyfikacja oraz usuwanie playlist które mają być odtwarzane na malinach
- Agenci - Dodawanie, modyfikacja, usuwanie, urządzeń końcowych, w domyśle Raspberry Pi odpowiedzialne za dystrybucje.
- Grupy - Zarządzanie grupami oraz tworzenie i modyfikacja zdarzeń w interaktywnym kalendarzu (FullCalendar) które mają być realizowane przez przypisane do grupy maliny.

## Demo / Podgląd aplikacji
Dashboard
![Dashboard](https://i.imgur.com/4ftNA33.png)

---

Biblioteka mediów i podgląd
![Biblioteka mediow](https://i.imgur.com/aqgzv5K.png)
![Biblioteka mediow podglad](https://i.imgur.com/HpX1Lqb.png)

---

Playlisty i panel edycji wraz z podglądem
![Playlisty](https://i.imgur.com/Ou7hW6Q.png)
![Edycja playlisty](https://i.imgur.com/rQSaVCC.png)

---

Agenci i panel dodawania nowej maliny
![Agenci](https://i.imgur.com/Mmly0qZ.png)
![Dodawanie maliny](https://i.imgur.com/PTpaHZl.png)

---

Kalendarz oraz tworzenie nowej grupy
![Grupy](https://i.imgur.com/LmiKdj6.png)
![Tworzenie grupy](https://i.imgur.com/Lsct9GX.png)