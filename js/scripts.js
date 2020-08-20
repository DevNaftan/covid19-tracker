/* VARIABLES */
const $switch = document.querySelector('.switch')
const $body = document.querySelector('body')
const $header = document.querySelector('header')
const $main = document.querySelector('main')
const $searcher = document.querySelector('.searcher')
const $global = $main.querySelector('.global')
const $countries = $main.querySelector('.countries')
const mode = window.localStorage.getItem('mode')
const responsive = window.matchMedia('only screen and (max-width: 1023px)')
const BASE_COVIDAPI_URL = 'https://api.covid19api.com/'
const summary_covidapi_url = `${BASE_COVIDAPI_URL}summary`
const BASE_LOCATIONAPI_URL = 'https://ipapi.co/json/'

function inDevelopment() {
  swal({
    title: 'Developing',
    text: 'This feature is in development, come back later...',
    icon: 'info',
    button: 'OK',
  });
}

function error(section) {
  let value = ''
  if (section) {
    value = section
  }
  swal({
      title: 'Error',
      text: `Failed to get the ${value} information`,
      icon: 'error',
      buttons: ['Cancel', 'Retry']
    })
  .then(OK => {
    if (OK) {
      location.reload();
    }
  });
}


/* DARK MODE */
function darkMode() {
  document.body.classList.add('dark-mode')
  document.body.classList.remove('light-mode')
  $switch.querySelector('strong').textContent = 'Dark Mode'
  window.localStorage.setItem('mode', 'dark')
}

function lightMode() {
  document.body.classList.add('light-mode')
  document.body.classList.remove('dark-mode')
  $switch.querySelector('strong').textContent = 'Light Mode'
  window.localStorage.setItem('mode', 'light')
}

if (mode) {
  document.body.classList.add(`${mode}-mode`)
  if (mode === 'dark') {
    $switch.querySelector('#checkbox').setAttribute('checked', true)
    $switch.querySelector('strong').textContent = `Dark Mode`
  } else if (mode === 'light')
    $switch.querySelector('strong').textContent = `Light Mode`
} else {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $switch.querySelector('#checkbox').setAttribute('checked', true)
    $switch.querySelector('strong').textContent = 'Dark Mode'
  } else {
    $switch.querySelector('strong').textContent = 'Light Mode'
  }
}

$switch.querySelector('input').addEventListener('change', event => {
  if (event.target.checked) {
    darkMode()
  } else {
    lightMode()
  }
})


/* MOBILE MENU */
const menu_items = $header.querySelectorAll('li')
menu_items.forEach(menu_item => {
  menu_item.addEventListener('click', inDevelopment)
})

function closeMenuMobile() {
  openMobileMenu()
}
function openMobileMenu() {
  $header.querySelector('.navbar').style.transitionDuration  = '.3s'
  $body.querySelector('.cover').classList.toggle('cover-style')
  $header.querySelector('.navbar-icon').classList.toggle('icofont-navigation-menu')
  $header.querySelector('.navbar-icon').classList.toggle('icofont-close')
  if ($body.querySelector('.cover').classList.contains('cover-style')) {
    $body.style.overflow = 'hidden'
    $header.querySelector('.navbar').style.transform = 'translateX(0)'
    $body.querySelector('.cover').addEventListener('click', closeMenuMobile)
  } else {
    $body.style.overflow = 'auto'
    $header.querySelector('.navbar').style.transform = 'translateX(350px)'
    $body.querySelector('.cover').removeEventListener('click', closeMenuMobile)
  }
}
function responsiveMenu() {
  $header.querySelector('.navbar').style.transitionDuration  = 'initial'
  if (responsive.matches) {
    $header.querySelector('.navbar').style.transform = 'translateX(320px)'
    $header.querySelector('.navbar-icon').classList.remove('hide')
    $header.querySelector('.stay-home').style.display = 'block'
    $header.querySelector('.reference-data').classList.remove('hide')
    $header.querySelector('.navbar-icon').addEventListener('click', openMobileMenu)
  } else {
    $header.querySelector('.navbar').style.transform = 'translateX(0)'
    $header.querySelector('.navbar-icon').classList.add('hide')
    $header.querySelector('.stay-home').style.display = 'none'
    $header.querySelector('.reference-data').classList.add('hide')
    $header.querySelector('.navbar-icon').removeEventListener('click', openMobileMenu)
    $body.style.overflow = 'auto'
    $body.querySelector('.cover').classList.remove('cover-style')
    $header.querySelector('.navbar-icon').classList.remove('icofont-close')
    $header.querySelector('.navbar-icon').classList.add('icofont-navigation-menu')
    $body.querySelector('.cover').removeEventListener('click', closeMenuMobile)
  }
}
responsive.addEventListener('change', () => {
  responsiveMenu()
})
responsiveMenu()


/* LOADER */
function generateLoader() {
  let attributes = {
    src: './assets/images/covid-loader.gif',
    alt: 'COVID Loader',
    width: '50px',
    height: '50px'
  }
  let loader = document.createElement('img')
  for (let key in attributes) {
    loader.setAttribute(`${key}`, `${attributes[key]}`)
  }
  return loader
}

function showHideLoader(section) {
  const loader = generateLoader()
  const loaderContainer = $main.querySelector(`.${section}`).querySelector('figure')
  if (loaderContainer.classList.contains('hide')) {
    loaderContainer.textContent = ''
    loaderContainer.classList.remove('hide')
    loaderContainer.append(loader)
  } else {
    loaderContainer.classList.add('hide')
  }
}


/* SEARCH */
$searcher.querySelector('input').addEventListener('click', () => {
  $searcher.scrollIntoView()
  header = 60
  const scrollY = window.scrollY
  if(scrollY) {
    window.scroll(0, scrollY - header)
  }
})
$searcher.addEventListener('submit', event => event.preventDefault())
$searcher.querySelector('input').addEventListener('keyup', () => {
  const formData = new FormData($searcher)
  const data = formData.get('search');
  const countriesList = $countries.querySelectorAll('.report-box')
  countriesList.forEach(country => {
    const countryTitle = country.querySelector('.report-box__title').innerHTML
    if(countryTitle.toLowerCase().indexOf(data.toLowerCase()) > -1) {
      country.classList.remove('hide')
    } else {
      country.classList.add('hide')
    }
  })
})



/* DATA */
async function getData(url) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

async function getLocation(url) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

function cardStringTemplate(data, location) {
  let headerString
  let date
  let locationString = ''
  if (data.Country) {
    headerString = `${data.Country} (${data.CountryCode})`
    date = data.Date
  } else {
    headerString = 'GLOBAL'
    date = data.Date
    data = data.Global
  }
  if (location) {
    locationString = ' - Current location'
  }
  return (
    `<div class="report-box report-box--global report-box--countries">
      <h3 class="report-box__title">${headerString}${locationString}</h3>
      <div class="report-box__details report-box--global__details report-box--countries__details">
        <div class="small-box"><strong>Confirmed</strong><p>${data.TotalConfirmed} (<span class='infected'>+${data.NewConfirmed}</span>)</p></div>
        <div class="small-box"><strong>Deceased</strong><p>${data.TotalDeaths} (<span class='death'>+${data.NewDeaths}</span>)</p></div>
        <div class="small-box"><strong>Recovered</strong><p>${data.TotalRecovered} (<span class='cured'>+${data.NewRecovered}</span>)</p></div>
      </div>
      <div class="report-box__date"><p>Last update</p><span>${date}</span></div>
    </div>`
  )
}

function cardHTMLTemplate(data, location) {
  const stringTemplate = cardStringTemplate(data, location)
  const HTML = document.implementation.createHTMLDocument()
  HTML.body.innerHTML = stringTemplate
  return HTML.body.children[0]
}
function renderGlobalCard(data) {
  try {
    let card = cardHTMLTemplate(data)
    showHideLoader('global')
    $global.querySelector('.content').append(card)
  } catch {
    $global.querySelector('.content').textContent = ''
    error('global')
  }
}
async function renderCountriesCard(data) {
  try {
    $countries.querySelector('h2').append(` (${data.length})`)
    const {country: countryCode} = await getLocation(BASE_LOCATIONAPI_URL)
    let country = data.find(data => {
      return data.CountryCode === countryCode
    })
    let locationCard = cardHTMLTemplate(country, countryCode)
    showHideLoader('countries')
    $countries.querySelector('.content').append(locationCard)
    data.forEach(data => {
      if (data.CountryCode !== countryCode) {
        let card = cardHTMLTemplate(data)
        $countries.querySelector('.content').append(card)
      }
    });
  } catch {
    $countries.querySelector('.content').textContent = ''
    error('countries')
  }
}

(async () => {
  try {
    showHideLoader('global')
    showHideLoader('countries')
    const data = await getData(summary_covidapi_url)
    renderGlobalCard(data)
    renderCountriesCard(data.Countries)
  } catch {
    $global.querySelector('.content').textContent = ''
    $countries.querySelector('.content').textContent = ''
    error()
  }
})()