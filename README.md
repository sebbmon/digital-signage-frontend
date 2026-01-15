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
![Dashboard](https://imgur.com/Nudpe4y)

![Biblioteka mediow](https://imgur.com/4nMNkdf)
![Biblioteka mediow podglad](https://imgur.com/e26kpZw)

![Playlisty](https://imgur.com/tuvHSzx)
![Edycja playlisty](https://imgur.com/IeFmnXH)

![Agenci](https://imgur.com/QMNGGaE)
![Dodawanie maliny](https://imgur.com/LiXCblj)

![Grupy](https://imgur.com/q5lelEr)
![Tworzenie grupy](https://imgur.com/TS8gzON)