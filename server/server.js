
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import {Configuration, OpenAIApi} from "openai";

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});

const openAi = new OpenAIApi(configuration);

const app = express();
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.use(cors());
app.use(express.json());

app.get("/", async (request, result) => {
	result.status(200).send({
		message: "Hello from CodeX!"
	});
});

app.post("/", async (request, result) => {
	try {
		const prompt = request.body.prompt;

		const response = await openAi.createCompletion({
			model: "text-davinci-003",
			prompt: `${prompt}`,
			temperature: 0,
			max_tokens: 2048,
			top_p: 1,
			frequency_penalty: 0.5,
			presence_penalty: 0
		});

		result.status(200).send({
			bot: response.data.choices[0].text
		});
	} catch (error) {
		console.log(error);
		result.status(500).send({error});
	}
});

app.listen(8080, () => console.log("Server is running on port http://localhost:8080"));
