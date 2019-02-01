export default class Contacts {
    constructor({dataUrl = 'contacts.json', desktop = true} = {}) {
        this.parameters = {
            dataUrl,
            desktop
        };
        this.init();
        return this;
    }

    async init() {
        await this.loadContactsData();
        this.renderCountriesSlider();
        this.renderCountriesMenu();
    }

    async loadContactsData() {
        this.contactsData = await fetch(this.parameters.dataUrl).then(response => response.json());
        this.countries = Object.entries(this.contactsData);
    }

    renderCountriesMenu() {
        const menuNode = document.querySelector('#countriesMenu');
        menuNode.onchange = event => this.selectCountry(event.target.value);
        menuNode.innerHTML = '';
        this.countries.forEach(country => {
            const optionNode = document.createElement('option');
            optionNode.value = country[0];
            optionNode.innerText = this.getL10n(country[1].title);
            menuNode.appendChild(optionNode);
        })
    }

    renderCountriesSlider() {
        const sliderNode = document.querySelector('.contacts-slider');
        sliderNode.innerHTML = '';
        this.countries.forEach(country => {
            const slideNode = document.createElement('div');
            slideNode.className = 'country-card';
            slideNode.dataset.country = country[0];
            slideNode.innerHTML = `<h3 class="title">${this.getL10n(country[1].title)}</h3><div class="country-content">
<div class="cities-section"></div><div class="contacts-details"><div><h4 class="label">Выберете город из списка</h4></div>
<a class="show-feedback-button" href="#feedback">Оставить заявку</a></div></div>`;
            sliderNode.appendChild(slideNode);
        })
    }

    selectCountry(country) {
        if (this.parameters.desktop) this.scrollToCountry(country);
    }

    scrollToCountry(country) {
        document.querySelector('.contacts-slider').scrollTo({
            left: document.querySelector(`.country-card[data-country="${country}"]`).offsetLeft - 160,
            behavior: 'smooth'
        });
    }

    getL10n(value, language = 'ru') {
        if (typeof value !== "object") return value;
        if (value[language]) return value[language];
        return Object.values(value)[0];
    }
}
