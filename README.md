# Discord AI Image Generation Bot

## Overview

This is a Discord bot designed for AI image generation using the NovelAI API. The bot can generate anime-style and other artistic images based on user prompts, offering several customization options. It temporarily stores the generated images on a Node.js server, sends them to Discord, and deletes the temporary files afterward.

---

## Features

- **Anime Image Generation**: Generate beautiful anime-style images with customizable prompts and settings.
- **Multi-Image Generation**: Create up to 5 images at once.
- **Vibe Transfer**: Apply artistic effects to user-uploaded images.
- **Customizable Parameters**: Modify resolution, steps, sampler, and more.
- **Efficient Storage**: Temporary image files are automatically deleted after being sent.

---

## Commands

### `anime`
Generate a single anime-style image.
- **Options:**
  - `prompt` (Required): Describe the image you want.
  - `negative_prompt` (Required): Specify elements to exclude.
  - `sampler` (Required): Choose between `DPM++ 2s Ancestral` or `Euler (Standard)`.
  - `model` (Required): Select `Anime` or `Furry`.
  - `steps` (Required): Choose between `15` or `28` steps.
  - `resolution` (Required): Choose from `832x1216`, `512x512`, `1216x832`, or `1024x1024`.

### `anime_five`
Generate five anime-style images.
- **Options:** Same as `anime`.

### `vibetransfer`
Apply artistic effects to user-uploaded images.
- **Options:**
  - `prompt` (Required): Describe the vibe or effect.
  - `negative_prompt` (Required): Specify elements to exclude.
  - `sampler` (Required): Same as `anime`.
  - `model` (Required): Same as `anime`.
  - `steps` (Required): Same as `anime`.
  - `resolution` (Required): Same as `anime`.
  - `reference_information_em` (Required): Set reference strength (e.g., `0.6`, `0.8`, or `1`).
  - `reference_image_multiple` (Required): Upload the reference image.
  - `reference_strength_multiple` (Required): Set strength of reference (e.g., `0.6`, `0.8`, or `1`).

### `help`
Get help with the bot.

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SecurityDevice/novelai-discord-bot.git
   cd novelai-discord-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Bot**
   Open the `bot.js` file and set your configuration values directly:
   ```javascript
   ////// CONFIGURATION //////
   const apiToken = 'your_novelai_api_key';
   const discordBotToken = 'your_discord_bot_token';
   const clientId = 'your_client_id';
   const GUILD_ID = 'your_guild_id';
   ```

4. **Start the Bot**
   ```bash
   node bot.js
   ```

---

## Usage

1. Invite the bot to your Discord server.
2. Use the commands described above to generate images.
3. Enjoy the creative possibilities!

---


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

If you encounter any issues or have questions, feel free to open an issue on GitHub or contact the developer directly.

---

## Acknowledgments

- [NovelAI](https://novelai.net) for the amazing API.
- Discord.js library for seamless bot development.
