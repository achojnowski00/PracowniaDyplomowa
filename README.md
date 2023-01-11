# Czym jest to repozytorium?

To repozytorium zawiera dokumenty i materiały związane z realizacją zajęć Pracowni Dyplomowej na Wydziale Matematyki i Informatyki Uniwersytetu Warmińsko-Mazurskiego.

Zaweirają się tu m.in.:

- dokumentacja projektu
- projekt aplikacji
- materiały pomocnicze w pisaniu aplikacji

# Uruchamianie projektu backendu w FastAPI

Zalecane uruchamianie: windows i konsola CMD (powershell czasem miewa problemy)

Będąc w głownym folderze repozytorium (...\PracowniaDyplomowa) stworz witrualne środowisko:
`python -m venv env `

Uruchom wirtualne środowisko:
`.\env\Scripts\activate.bat`

Przejdz do folderu API:
`cd API`

Zainstaluj potrzebnye paczki:
`pip install -r requirements.txt`

Uruchom program XAMPP, uruchom usługę Apache i MySQL a bastępnie swtórz bazę danych `homeorganizer`

Upewnij się, że jesteś w folderze \API, następnie uruchom serwer backendu
`uvicorn main:app --reload`

Swagger UI dostępny jest pod linkiem `http://localhost:8000/docs`

# Uruchamianie projektu backendu w React.JS

Będąc w głownym folderze repozytorium (...\PracowniaDyplomowa) przejdz do folderu \frontend, a następnie zainstaluj potrzebne paczki JavaScriptu (Wymagany Node 14.17.3, na innych wersjach Node projekt może się nie odpalić): `npm install`

Po zainstalowaniu paczek możesz uruchomić aplikację: `npm start`

Aplikacja dostępna pod linkiem `http://localhost:3000`
