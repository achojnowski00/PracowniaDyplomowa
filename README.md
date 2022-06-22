# uruchamianie projektu FastAPI
## tworzenie witrualnego środowiska:
python -m venv env 
## uruchomienie wirtualnego środowiska
env\Scripts\activate.bat
## instalowanie potrzebnych paczek
pip install -r API\requirements.txt
## uruchamianie serwera backendu
ucivorn API.main:app --reload
