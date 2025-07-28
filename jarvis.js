const statusDiv = document.getElementById("status");
const chatBox = document.getElementById("chat-box");
const startBtn = document.getElementById("start-btn");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
  appendChat("JARVIS: " + text);
}

function appendChat(text) {
  const msg = document.createElement("p");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getWeather(city) {
  const apiKey = "YOUR_API_KEY"; // 🔁 Replace with your OpenWeatherMap API key
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      speak(`The weather in ${city} is ${desc} with a temperature of ${temp}°C.`);
    })
    .catch(() => speak("Sorry, I couldn't fetch the weather."));
}

function handleCommand(command) {
  const c = command.toLowerCase();

  if (c.includes("hello") || c.includes("hi")) {
    speak("Hi boss. How can I help you?");
  } else if (c.includes("what is the time")) {
    const now = new Date();
    speak(`It's ${now.toLocaleTimeString()}`);
  } else if (c.includes("what is the date")) {
    const now = new Date();
    speak(`Today is ${now.toDateString()}`);
  } else if (c.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://youtube.com", "_blank");
  } else if (c.includes("weather in")) {
    const city = c.split("weather in")[1].trim();
    getWeather(city);
  } else if (c.includes("play music")) {
    speak("Playing music now");
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.play();
  } else {
    speak("Sorry, I didn’t understand that.");
  }
}

recognition.onstart = () => {
  statusDiv.textContent = "Listening...";
};

recognition.onerror = (event) => {
  speak("I'm sorry boss, I encountered a recognition error.");
  statusDiv.textContent = "Error: " + event.error;
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  appendChat("You: " + transcript);
  handleCommand(transcript);
};

startBtn.addEventListener("click", () => {
  speak(`Hello boss. Today is ${new Date().toDateString()}, and the time is ${new Date().toLocaleTimeString()}. How can I assist you?`);
  recognition.start();
});
