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
- `src/app/pages/` – wszystkie strony Angular odpowiedzialne za UI (dashboard, media, playlisty, agenci)
- `src/app/services/` – serwisy które zarządzają logiką biznesową i połączeniami z API
- `src/app/interceptors/` – Http interceptory, np. `AuthInterceptor` i `ApiPrefixInterceptor`
- `src/environments/` – konfiguracja środowiska (`environment.ts`) do celów portfolio

## Strony aplikacji
- Dashboard - Pokazuje ogólne statystyki: liczniki grup, playlist, mediów wrzuconych na serwer oraz ilość urządzeń w systemie
- Media - Dodawanie, usuwanie, pobieranie, edycja oraz podgląd mediów wrzuconych na serwer
- Playlisty - Tworzenie, modyfikacja oraz usuwanie playlist które mają być odtwarzane na malinach
- Agenci - Dodawanie, modyfikacja, usuwanie, urządzeń końcowych, w domyśle Raspberry Pi odpowiedzialne za dystrybucje.
- Grupy - Zarządzanie grupami oraz tworzenie i modyfikacja zdarzeń w interaktywnym kalendarzu (FullCalendar) które mają być realizowane przez przypisane do grupy maliny.

## Demo / Podgląd aplikacji
![Dashboard](https://i.imgur.com/Nudpe4y.png)

![Biblioteka mediow](https://i.imgur.com/4nMNkdf.png)
![Biblioteka mediow podglad](https://i.imgur.com/e26kpZw.png)

![Playlisty](https://i.imgur.com/tuvHSzx.png)
![Edycja playlisty](https://i.imgur.com/IeFmnXH.png)

![Agenci](https://i.imgur.com/QMNGGaE.png)
![Dodawanie maliny](https://i.imgur.com/LiXCblj.png)

![Grupy](https://i.imgur.com/q5lelEr.png)
![Tworzenie grupy](https://i.imgur.com/TS8gzON.png)