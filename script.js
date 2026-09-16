const form = document.querySelector("#weather-form");
const apiKeyInput = document.querySelector("#api-key");
const cityInput = document.querySelector("#city");
const countryInput = document.querySelector("#country");
const toggleKeyButton = document.querySelector("#toggle-key");
const getWeatherButton = document.querySelector("#get-weather");
const formMessage = document.querySelector("#form-message");
const weatherEmpty = document.querySelector("#weather-empty");
const weatherResult = document.querySelector("#weather-result");
const locationName = document.querySelector("#location-name");
const conditionText = document.querySelector("#condition-text");
const temperatureValue = document.querySelector("#temperature-value");
const weatherIcon = document.querySelector("#weather-icon");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const visibility = document.querySelector("#visibility");
const clouds = document.querySelector("#clouds");
const updatedAt = document.querySelector("#updated-at");

const weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather";
const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});
let requestController;

function showMessage(message) {
  formMessage.textContent = message;
  formMessage.hidden = false;
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.hidden = true;
}

function setBusy(isBusy, label) {
  getWeatherButton.disabled = isBusy;
  getWeatherButton.textContent = label;
  toggleKeyButton.disabled = isBusy;
}

function showWeather(data) {
  const weather = Array.isArray(data.weather) ? data.weather[0] : null;
  const main = data.main || {};
  const windData = data.wind || {};
  const cloudsData = data.clouds || {};
  const system = data.sys || {};
  const location = [data.name, system.country].filter(Boolean).join(", ");

  locationName.textContent = location || "Location unavailable";
  conditionText.textContent = weather?.description || "Condition unavailable";
  temperatureValue.textContent = numberFormatter.format(main.temp);

  if (weather?.icon) {
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIcon.alt = weather.description ? `${weather.description} icon` : "Weather icon";
    weatherIcon.hidden = false;
  } else {
    weatherIcon.removeAttribute("src");
    weatherIcon.alt = "";
    weatherIcon.hidden = true;
  }

  feelsLike.textContent = main.feels_like === undefined
    ? "Unavailable"
    : `${numberFormatter.format(main.feels_like)} °C`;
  humidity.textContent = main.humidity === undefined
    ? "Unavailable"
    : `${main.humidity}%`;
  wind.textContent = windData.speed === undefined
    ? "Unavailable"
    : `${numberFormatter.format(windData.speed)} m/s`;
  pressure.textContent = main.pressure === undefined
    ? "Unavailable"
    : `${main.pressure} hPa`;
  visibility.textContent = main.visibility === undefined
    ? "Unavailable"
    : `${numberFormatter.format(main.visibility / 1000)} km`;
  clouds.textContent = cloudsData.all === undefined
    ? "Unavailable"
    : `${cloudsData.all}%`;

  const observationTime = data.dt ? new Date(data.dt * 1000) : null;
  updatedAt.textContent = observationTime
    ? `Updated ${observationTime.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : "Updated just now";

  weatherEmpty.hidden = true;
  weatherResult.hidden = false;
}

function getApiError(response, data) {
  if (response.status === 401 || response.status === 403) {
    return "That API key is invalid or not authorized. Check your OpenWeatherMap key and try again.";
  }

  if (response.status === 404) {
    return "We could not find that city and country. Check the spelling and two-letter country code.";
  }

  if (response.status === 429) {
    return "The weather service is rate-limited. Please wait a moment and try again.";
  }

  if (data?.message) {
    return `${data.message} Please try again.`;
  }

  return "Unable to retrieve weather data. Please try again.";
}

async function loadWeather(event) {
  event.preventDefault();
  clearMessage();

  const apiKey = apiKeyInput.value.trim();
  const city = cityInput.value.trim();
  const country = countryInput.value.trim();

  if (!apiKey) {
    showMessage("Enter your OpenWeatherMap API key.");
    apiKeyInput.focus();
    return;
  }

  if (!city) {
    showMessage("Enter a city to search.");
    cityInput.focus();
    return;
  }

  if (!country) {
    showMessage("Enter a two-letter country code, such as GB or US.");
    countryInput.focus();
    return;
  }

  if (!/^[A-Za-z]{2}$/.test(country)) {
    showMessage("Country must be a two-letter code, such as GB or US.");
    countryInput.focus();
    return;
  }

  requestController?.abort();
  requestController = new AbortController();
  setBusy(true, "Loading...");

  const query = new URLSearchParams({
    q: `${city}, ${country}`,
    appid: apiKey,
    units: "metric",
  });

  try {
    const response = await fetch(`${weatherEndpoint}?${query}`, {
      signal: requestController.signal,
      headers: { Accept: "application/json" },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      showMessage(getApiError(response, data));
      return;
    }

    showWeather(data);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    showMessage("We could not connect to the weather service. Check your internet connection and try again.");
  } finally {
    if (requestController) {
      setBusy(false, "Get Weather");
      requestController = null;
    }
  }
}

function toggleApiKeyVisibility() {
  const isHidden = apiKeyInput.type === "password";
  apiKeyInput.type = isHidden ? "text" : "password";
  toggleKeyButton.textContent = isHidden ? "Hide" : "Show";
  toggleKeyButton.setAttribute("aria-label", isHidden ? "Hide API key" : "Show API key");
  toggleKeyButton.setAttribute("aria-pressed", String(isHidden));
}

form.addEventListener("submit", loadWeather);
toggleKeyButton.addEventListener("click", toggleApiKeyVisibility);
