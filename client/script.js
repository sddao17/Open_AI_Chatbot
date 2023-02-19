
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat-container");

let loadInterval;

function loader(element) {
	element.textContent = "";

	loadInterval = setInterval(() => {
		element.textContent += ".";

		if (element.textContent === "....") {
			element.textContent = "";
		}
	}, 300);

}

function typeText(element, text) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			++index;
		} else {
			clearInterval(interval);
		}
	}, 15);
}

function generateUniqueId() {
	const timeStamp = Date.now();
	const randomNumber = Math.random();
	const hexString = randomNumber.toString(16);

	return `id-${timeStamp}-${hexString}`;
}

function chatStripe(isAi, value, uniqueId) {
	return (
			`
			<div class="wrapper ${isAi && 'ai'}">
				<div class="chat">
        	<div class="profile">
        		<i class="img ${isAi ? "fas fa-robot" : "fas fa-user"}"></i>
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
			`
	);
}

const handleSubmit = async (event) => {
	event.preventDefault();

	// Reset the size of the textarea after text submission
	const textarea = document.querySelector("textarea");
	textarea.style.height = "42px";

	const data = new FormData(form);

	// User's chat stripe
	chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
	form.reset();

	// Bot's chat stripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
	chatContainer.scrollTop = chatContainer.scrollHeight;

	const messageDiv = document.getElementById(uniqueId);
	loader(messageDiv);

	// Fetch data form the server and get the bot's response
	const response = await fetch("https://server-dot-openai-chat-gpt-chatbot.uw.r.appspot.com", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			prompt: data.get("prompt")
		})
	});

	clearInterval(loadInterval);
	messageDiv.innerHTML= "";

	if (response.ok) {
		const data = await response.json();
		const parsedData = data.bot.trim();

		typeText(messageDiv, parsedData);
	} else {
		const err = await response.text();
		console.log(err);

		messageDiv.innerHTML = "Something went wrong; please try again later.";
	}
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keydown", (event) => {
	if (event.keyCode === 13 && event.shiftKey === false) {
		handleSubmit(event).then();
	}
});
