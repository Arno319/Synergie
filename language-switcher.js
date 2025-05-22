/**
 * StudentBuddy taalwisselaar script
 * Implementeert functionaliteit om te wisselen tussen Nederlands en Engels
 */

function initializeLanguageSwitcher(translations, updateFunction) {
    // Haal taalvoorkeur op uit localStorage of gebruik Nederlands als standaard
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('preferredLanguage') || 'nl';
    
    // Stel actieve taal in
    setActiveLanguage(currentLang);
    
    // Update de pagina-inhoud voor de huidige taal
    if (updateFunction) {
        updateFunction(currentLang, translations);
    }
    
    // Voeg event listeners toe aan de taalknoppen
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setActiveLanguage(lang);
            if (updateFunction) {
                updateFunction(lang, translations);
            }
            localStorage.setItem('preferredLanguage', lang);
        });
    });
    
    // Hulpfunctie om de actieve taal visueel aan te duiden
    function setActiveLanguage(lang) {
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Geef de huidige taal terug
    return currentLang;
}
