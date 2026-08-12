import dotenv from "dotenv";

dotenv.config();

const response = await fetch(
  "https://lichess.org/api/bot/account/upgrade",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`
    }
  }
);

console.log(response.status);
console.log(await response.text());;
