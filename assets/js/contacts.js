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
		this.countries.forEach(country => country[1].citiesList = Object.entries(country[1].cities));
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
			const citiesSectionNode = slideNode.querySelector('.cities-section');
			citiesSectionNode.innerHTML = '';
			country[1].citiesList.forEach(city => {
				const cityLinkNode = document.createElement('a');
				cityLinkNode.innerText = this.getL10n(city[1].title);
				cityLinkNode.onclick = event => this.renderCity(country[0], city[0]);
				cityLinkNode.classList.toggle('primary-city', city[1]['primary']);
				citiesSectionNode.appendChild(cityLinkNode);
			});
			sliderNode.appendChild(slideNode);
		})
	}

	renderCity(country, city) {
		const cityData = this.contactsData[country].cities[city];
		if (this.parameters.desktop) {
			const detailsNode = document.querySelector(`.country-card[data-country="${country}"]`).querySelector('.contacts-details');
			detailsNode.innerHTML = `
			<div>
				<h4 class="label">Адрес:</h4>
				<p class="caption">${this.getL10n(cityData.address)}</p>
			</div>
			<div>
				<h4 class="label">Рабочее время:</h4>
				<p class="caption">${this.getL10n(cityData.time)}</p>
			</div>
			<div>
				<h4 class="label">Email</h4>
				<a class="caption" href="mailto:${this.getL10n(cityData.email)}">${this.getL10n(cityData.email)}</a>
			</div>
			<a class="show-feedback-button" href="#feedback">Оставить заявку</a>
			<div class="social-icons">
				<a class="vk-icon" href="#"></a>
				<a class="fb-icon" href="#"></a>
				<a class="yt-icon" href="#"></a>
				<a class="ok-icon" href="#"></a>
			</div>`
		}
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
