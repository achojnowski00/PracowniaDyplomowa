# Czym jest to repozytorium?

To repozytorium zawiera dokumenty i materiały związane z realizacją zajęć Pracowni Dyplomowej na Wydziale Matematyki i Informatyki Uniwersytetu Warmińsko-Mazurskiego.

Zaweirają się tu m.in.:

- dokumentacja projektu
- projekt aplikacji
- materiały pomocnicze w pisaniu aplikacji

# Uruchamianie projektu backendu w FastAPI

tworzenie witrualnego środowiska:
`python -m venv env `

uruchomienie wirtualnego środowiska
`env\Scripts\activate.bat`

instalowanie potrzebnych paczek
`pip install -r API\requirements.txt`

uruchamianie serwera backendu
`uvicorn API.main:app --reload`
