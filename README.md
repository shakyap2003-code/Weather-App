# Weatherly

Weatherly is a responsive static weather application built with HTML, CSS, and JavaScript. It uses the OpenWeatherMap Current Weather API to show the current temperature, weather condition, and useful details such as feels-like temperature, humidity, wind, pressure, visibility, and cloud cover.

The API key is entered in the web interface and is not stored in the project files.

## Run the app

1. Create an OpenWeatherMap account and generate an API key.
2. Open this project in an editor.
3. Start a local static server. For example, with Python:

   ```bash
   python -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000) in a browser.
5. Enter your API key, city, and two-letter country code, then select **Get Weather**.

You can also open `index.html` with a browser extension such as VS Code Live Server. A local server is recommended because browser security restrictions can affect API requests when a page is opened directly from the file system.

## Notes

- Weather values are displayed in Celsius, metres per second, hectopascals, and kilometres.
- The app shows separate messages for missing input, unknown locations, invalid API keys, rate limits, and connection failures.
- An internet connection and a valid OpenWeatherMap API key are required.
- The API key is sent from the browser directly to OpenWeatherMap and is not saved by Weatherly.
