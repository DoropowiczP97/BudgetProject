# BudgetProject

BudgetProject to aplikacja do prowadzenia budżetu osobistego.
Aktualny zakres obejmuje obsługę transakcji (przychód/wydatek), filtrowanie listy, podsumowania i autoryzację użytkownika przez Keycloak.

## Co jest gotowe

- logowanie i autoryzacja JWT (Keycloak)
- CRUD transakcji
- lista transakcji z filtrowaniem, sortowaniem i paginacją
- podsumowanie: suma przychodów, wydatków, saldo, agregacja miesięczna i wg kategorii
- UI w Angular Material

## Co warto wiedzieć przed pracą

- backend jest podzielony na warstwy Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`)
- endpointy API wymagają autoryzacji
- dane są izolowane per użytkownik (filtrowanie po `UserId` z tokenu)
- na tym etapie projekt jest rozwijany bez testów automatycznych

## Struktura repozytorium

| Ścieżka | Rola |
| --- | --- |
| `BudgetBE/` | Backend .NET |
| `BudgetFE/` | Frontend Angular |
| `infra/` | Konfiguracja infrastruktury (Keycloak, motywy, import realm) |
| `docker-compose.yml` | Pełny stack: FE + BE + DB + Keycloak |
| `docker-compose.be.yml` | Stack backendowy: BE + DB + Keycloak |

## Jak działa przepływ danych

1. Użytkownik loguje się w Keycloak.
2. Frontend wysyła token JWT w żądaniach do API.
3. Backend odczytuje `sub` i przypisuje operacje do konkretnego użytkownika.
4. Handler CQRS wykonuje logikę aplikacyjną.
5. Dane zapisywane i odczytywane są z PostgreSQL.

## Warianty uruchamiania

| Wariant | Kiedy używać |
| --- | --- |
| `docker-compose.yml` | lokalne odpalanie całego środowiska |
| `docker-compose.be.yml` | praca nad backendem bez kontenera FE |
| `BudgetBE/BudgetApi/docker-compose.yml` | praca z poziomu solucji backendowej (np. Visual Studio) |

Uwaga: w wariancie `BudgetBE/BudgetApi/docker-compose.yml` frontend działa lokalnie poza kontenerem.

## Ograniczenia obecnej wersji

- brak testów jednostkowych i integracyjnych
- pojedynczy główny obszar domenowy (transakcje)
- konfiguracja DEV jest jawna i uproszczona

---

## Informacje konfiguracyjne (DEV)

### Endpointy aplikacji

| Usługa | URL | Logowanie |
| --- | --- | --- |
| Frontend (Angular) | http://localhost:4200 | brak |
| Backend API | http://localhost:5000 | JWT z Keycloak |
| Swagger UI | http://localhost:5000/swagger | JWT z Keycloak |

### Keycloak

| Element | Wartość |
| --- | --- |
| Panel administracyjny | http://localhost:8080 |
| Admin login | admin |
| Admin hasło | admin |
| Realm | budget |
| Test user login | budget.user |
| Test user hasło | BudgetUser123! |
| Client FE | budget-frontend |
| Client API | budget-api |
| Client secret (API) | budget-api-secret |

### pgAdmin

| Element | Wartość |
| --- | --- |
| URL | http://localhost:5050 |
| Email | admin@budget.dev |
| Hasło | admin |

### PostgreSQL (baza aplikacji)

| Element | Wartość |
| --- | --- |
| Host | localhost |
| Port | 5432 |
| Database | budgetdb |
| User | budget_user |
| Password | budget_pass |

### PostgreSQL (baza Keycloak)

| Element | Wartość |
| --- | --- |
| Host | localhost |
| Port | 5433 |
| Database | keycloakdb |
| User | keycloak_user |
| Password | keycloak_pass |
