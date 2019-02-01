export default class Contacts {
    constructor({dataUrl = 'contacts.json'} = {}) {
        this.parameters = {
            dataUrl
        };
        this.init();
        return this;
    }

    async init() {
        await this.loadContactsData();
        this.renderCountriesMenu();
    }

    async loadContactsData() {
        this.contactsData = await fetch(this.parameters.dataUrl).then(response => response.json());
        this.countries = Object.entries(this.contactsData);
    }

    renderCountriesMenu() {
        const menuNode = document.querySelector('#countriesMenu');
        menuNode.innerHTML = '';
        this.countries.forEach(country => {
            const optionNode = document.createElement('option');
            optionNode.value = country[0];
            optionNode.innerText = this.getL10n(country[1].title);
            menuNode.appendChild(optionNode);
        })
    }

    getL10n(value, language) {
        if (typeof value !== "object") return value;
        if (value[language]) return value[language];
        return Object.values(value)[0];
    }
}
