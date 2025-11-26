const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const JSZip = require('jszip');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

function isImage(filename) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = filename.split('.').pop().toLowerCase();
    return validExtensions.includes(fileExtension);
}

////// CONFIGURATION //////
const apiToken = '';
const discordBotToken = '';
const clientId = '';
const GUILD_ID = '';

const rest = new REST({ version: '9' }).setToken(discordBotToken);

// test command
client.on('messageCreate', async message => {
    if (message.content === '!delete') {
        // check if admin
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You tried to use !delete but you do not have the permission to use this command.');
        }
        const fetched = await message.channel.messages.fetch({ limit: 99 });
        message.channel.bulkDelete(fetched);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'anime') {

        await interaction.deferReply();

        try {
    
            const prompt = interaction.options.getString('prompt') + ', best quality, amazing quality';
            const negative_prompt = interaction.options.getString('negative_prompt') + ', lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]';
            const steps = interaction.options.getInteger('steps');
            const resolution = interaction.options.getString('resolution');
            const model = interaction.options.getString('model');
     
            const [width, height] = resolution.split('x').map(Number);
            let qualityToggle = true;
            let scales = 5;
            const sampler = interaction.options.getString('sampler');
      
            const response = await axios.post('https://image.novelai.net/ai/generate-image', {
                input: prompt,
                model: model,
                action: 'generate',
                parameters: {
                    params_version: 3,
                    width: width,
                    height: height,
                    scale: scales,
                    sampler: sampler,
                    steps: steps,
                    n_samples: 1,
                    ucPreset: 0,
                    qualityToggle: qualityToggle,
                    autoSmea: false,
                    dynamic_thresholding: false,
                    controlnet_strength: 1,
                    legacy: false,
                    add_original_image: true,
                    cfg_rescale: 0,
                    noise_schedule: 'karras',
                    legacy_v3_extend: false,
                    skip_cfg_above_sigma: null,
                    use_coords: false,
                    legacy_uc: false,
                    normalize_reference_strength_multiple: true,
                    inpaintImg2ImgStrength: 1,
                    seed: Math.floor(Math.random() * 4294967295),
                    characterPrompts: [],
                    v4_prompt: {
                        caption: {
                            base_caption: prompt,
                            char_captions: []
                        },
                        use_coords: false,
                        use_order: true
                    },
                    v4_negative_prompt: {
                        caption: {
                            base_caption: negative_prompt,
                            char_captions: []
                        },
                        legacy_uc: false
                    },
                    negative_prompt: negative_prompt,
                    deliberate_euler_ancestral_bug: false,
                    prefer_brownian: true
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                responseType: 'arraybuffer'
            });

        if (!response.data) {
            console.log('no data found in response');
            return;
        }
        console.log(sampler)

        const zip = new JSZip();

        const zipData = await zip.loadAsync(response.data);

        const file = zipData.files[Object.keys(zipData.files)[0]];
        
        const content = await file.async('nodebuffer');

        const filename = uuidv4() + '.png';

        fs.writeFileSync(filename, content);

        if (!isImage(filename)) {
            console.log('The generated file is not an image.');
            return;
        }

        let spoilerFilename = "SPOILER_" + filename;
        await interaction.editReply({ files: [{ attachment: filename, name: spoilerFilename }] });
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Anime Generator')
            .setDescription('Generated image based on the input text.')
            .addFields(
                    { name: 'Prompt', value: prompt },
                    { name: 'Negative Prompt', value: negative_prompt },
                    { name: 'Steps', value: steps.toString() },
                    { name: 'Resolution', value: resolution },
                    { name: 'Model', value: model },
                    { name: 'Qualitytoggle', value: qualityToggle.toString() },
                    { name: 'Scale', value: scales.toString() },
                    { name: 'Sampler', value: sampler }
            )
            .setTimestamp()
            .setFooter('by SecurityDevice + dominikdomex');

        await interaction.channel.send({ embeds: [embed] });
        await interaction.channel.send("--------END OF FILE-------")
  

        await new Promise(resolve => setTimeout(resolve, 5000));
        fs.unlinkSync(filename);
    } catch (error) {
        console.error('There is an error named:', error);
    }
}
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'vibetransfer') {

        await interaction.deferReply();

        try {
            const reference_image_multiple = interaction.options.getAttachment('reference_image_multiple');
            const filesname = `${uuidv4()}.png`;
            const imagePath = `./${filesname}`;
            
            const responses = await axios.get(reference_image_multiple.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(responses.data, 'binary');
            
            fs.writeFileSync(imagePath, buffer);
            
            const files = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(files).toString('base64');

            const prompt = interaction.options.getString('prompt') + ', best quality, amazing quality';
            const negative_prompt = interaction.options.getString('negative_prompt') + ', lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]';
            const steps = interaction.options.getInteger('steps');
            const resolution = interaction.options.getString('resolution');
            const model = interaction.options.getString('model');
            const reference_information_extracted_multiple = interaction.options.getNumber('reference_information_em');
            const reference_strength_multiple = interaction.options.getNumber('reference_strength_multiple');
            const sampler = interaction.options.getString('sampler');

            const [width, height] = resolution.split('x').map(Number);
            let qualityToggle = true;
            let scales = 5;

            const response = await axios.post('https://image.novelai.net/ai/generate-image', {
                input: prompt,
                model: model,
                action: 'generate',
                parameters: {
                    params_version: 3,
                    width: width,
                    height: height,
                    scale: scales,
                    sampler: sampler,
                    steps: steps,
                    n_samples: 1,
                    ucPreset: 0,
                    qualityToggle: qualityToggle,
                    autoSmea: false,
                    dynamic_thresholding: false,
                    controlnet_strength: 1,
                    legacy: false,
                    add_original_image: true,
                    cfg_rescale: 0,
                    noise_schedule: 'karras',
                    legacy_v3_extend: false,
                    skip_cfg_above_sigma: null,
                    use_coords: false,
                    legacy_uc: false,
                    normalize_reference_strength_multiple: true,
                    inpaintImg2ImgStrength: 1,
                    seed: Math.floor(Math.random() * 4294967295),
                    characterPrompts: [],
                    v4_prompt: {
                        caption: {
                            base_caption: prompt,
                            char_captions: []
                        },
                        use_coords: false,
                        use_order: true
                    },
                    v4_negative_prompt: {
                        caption: {
                            base_caption: negative_prompt,
                            char_captions: []
                        },
                        legacy_uc: false
                    },
                    negative_prompt: negative_prompt,
                    deliberate_euler_ancestral_bug: false,
                    prefer_brownian: true,
                    reference_information_extracted_multiple: [reference_information_extracted_multiple],
                    reference_image_multiple: [base64Image],
                    reference_strength_multiple: [reference_strength_multiple]
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                responseType: 'arraybuffer'
            });

            if (!response.data) {
                console.log('no data found in response');
                return;
            }
            console.log(sampler)
    
            const zip = new JSZip();
    
            const zipData = await zip.loadAsync(response.data);
    
            const file = zipData.files[Object.keys(zipData.files)[0]];
            
            const content = await file.async('nodebuffer');
    
            const filename = uuidv4() + '.png';
    
            fs.writeFileSync(filename, content);
    
            if (!isImage(filename)) {
                console.log('The generated file is not an image.');
                return;
            }
    
            let spoilerFilename = "SPOILER_" + filename;
            await interaction.editReply({ files: [{ attachment: filename, name: spoilerFilename }] });
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Anime Generator')
                .setDescription('Generated image based on the input text.')
                .addFields(
                        { name: 'Prompt', value: prompt },
                        { name: 'Negative Prompt', value: negative_prompt },
                        { name: 'Steps', value: steps.toString() },
                        { name: 'Resolution', value: resolution },
                        { name: 'Model', value: model },
                        { name: 'Qualitytoggle', value: qualityToggle.toString() },
                        { name: 'Scale', value: scales.toString() },
                        { name: 'Sampler', value: sampler },
                        { name: 'Reference Information Extracted Multiple', value: reference_information_extracted_multiple.toString() },
                        { name: 'Reference Strength Multiple', value: reference_strength_multiple.toString() },
                        { name: 'Reference Image Multiple', value: 'SPOILER_' + filesname }
                )
                .setTimestamp()
                .setFooter('by SecurityDevice + dominikdomex');
            await interaction.channel.send({ embeds: [embed] });
            await interaction.channel.send("--------END OF FILE-------")

            await new Promise(resolve => setTimeout(resolve, 5000));
            fs.unlinkSync(filename);
            await new Promise(resolve => setTimeout(resolve, 5000));
            fs.unlinkSync(filesname);
        } catch (error) {
            console.error('There is an error:', error);
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'anime_five') {
        await interaction.deferReply();

        try {
            const prompt = interaction.options.getString('prompt') + ', best quality, amazing quality';
            const negative_prompt = interaction.options.getString('negative_prompt') + ', lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]';
            const steps = interaction.options.getInteger('steps');
            const resolution = interaction.options.getString('resolution');
            const model = interaction.options.getString('model');
            const [width, height] = resolution.split('x').map(Number);
            const sampler = interaction.options.getString('sampler');

            let qualityToggle = true;
            let scales = 5;

            for (let i = 0; i < 5; i++) {
                const response = await axios.post('https://image.novelai.net/ai/generate-image', {
                    input: prompt,
                    model: model,
                    action: 'generate',
                    parameters: {
                        params_version: 3,
                        width: width,
                        height: height,
                        scale: scales,
                        sampler: sampler,
                        steps: steps,
                        n_samples: 1,
                        ucPreset: 0,
                        qualityToggle: qualityToggle,
                        autoSmea: false,
                        dynamic_thresholding: false,
                        controlnet_strength: 1,
                        legacy: false,
                        add_original_image: true,
                        cfg_rescale: 0,
                        noise_schedule: 'karras',
                        legacy_v3_extend: false,
                        skip_cfg_above_sigma: null,
                        use_coords: false,
                        legacy_uc: false,
                        normalize_reference_strength_multiple: true,
                        inpaintImg2ImgStrength: 1,
                        seed: Math.floor(Math.random() * 4294967295),
                        characterPrompts: [],
                        v4_prompt: {
                            caption: {
                                base_caption: prompt,
                                char_captions: []
                            },
                            use_coords: false,
                            use_order: true
                        },
                        v4_negative_prompt: {
                            caption: {
                                base_caption: negative_prompt,
                                char_captions: []
                            },
                            legacy_uc: false
                        },
                        negative_prompt: negative_prompt,
                        deliberate_euler_ancestral_bug: false,
                        prefer_brownian: true
                    }
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiToken}`
                    },
                    responseType: 'arraybuffer'
                });

                if (!response.data) {
                    console.log('no data found in response');
                    return;
                }

                const zip = new JSZip();
                const zipData = await zip.loadAsync(response.data);
                const file = zipData.files[Object.keys(zipData.files)[0]];
                const content = await file.async('nodebuffer');
                const filename = uuidv4() + '.png';

                fs.writeFileSync(filename, content);

                if (!isImage(filename)) {
                    console.log('The generated file is not an image.');
                    return;
                }
                await interaction.editReply({ content: 'Bilder werden generiert...' });
                let spoilerFilename = "SPOILER_" + filename;

                await interaction.channel.send({ files: [{ attachment: filename, name: spoilerFilename }] });
                await interaction.channel.send("--------END OF FILE-------");

                await new Promise(resolve => setTimeout(resolve, 5000));

                fs.unlinkSync(filename);
            }

        } catch (error) {
            console.error('There is an error named:', error);
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'help') {
        const helpembed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setThumbnail('https://dominikdomex.eu/ai.png')
            .setDescription('List of commands for the bot.')
            .addFields(
                { name: '/anime', value: 'Generate an anime image based on the input text.' },
                { name: '/vibetransfer', value: 'Vibe transfer image based on the input text.' },
                { name: '/help', value: 'Get help with the bot.' }
            )
            .setTimestamp()
            .setFooter('COPYRIGHT ||| by SecurityDevice + dominikdomex');
        await interaction.reply({ embeds: [helpembed] });
    }
});

client.once('ready', () => {
    console.log('ready');
    client.user.setActivity('/help | by SecurityDevice + dominikdomex', { type: 'WATCHING' });
});

const commands = [
    {
        name: 'anime',
        description: 'Generate an anime image based on the input text.',
        type: 1, 
        options: [
            {
                name: 'prompt',
                type: 3, 
                description: 'What should the image contain?',
                required: true,
            },
            {
                name: 'negative_prompt',
                type: 3, 
                description: 'What should the image not contain?',
                required: true,
            },
            {
                name: 'sampler',
                type: 3, 
                description: 'What sampler?',
                required: true,
                choices: [
                    {
                        name: 'DPM++ 2s Ancestral',
                        value: 'k_dpmpp_2s_ancestral',
                    },
                    {
                        name: 'Euler (Standard)',
                        value: 'k_euler',
                    },
                ],
            },
            {
                name: 'model',
                type: 3, 
                description: 'What model?',
                required: true,
                choices: [
                    {
                        name: 'V4.5 Full',
                        value: 'nai-diffusion-4-5-full',
                    },
                    {
                        name: 'V4.5 Curated',
                        value: 'nai-diffusion-4-5-curated',
                    },
                ],
            },
            {
                name: 'steps',
                type: 4, 
                description: 'How many steps?',
                required: true,
                choices: [
                    {
                        name: '15 steps',
                        value: '15',
                    },
                    {
                        name: '28 steps',
                        value: '28',
                    },
                ],
            },
            {
                name: 'resolution',
                type: 3, 
                description: 'What resolution?',
                required: true,
                choices: [
                    {
                        name: '832x1216',
                        value: '832x1216',
                    },
                    {
                        name: '512x512',
                        value: '512x512',
                    },
                    {
                        name: '1216x832',
                        value: '1216x832',
                    },
                    {
                        name: '1024x1024',
                        value: '1024x1024',
                    },
                ],
            },
        ]
    },
    {
        name: 'anime_five',
        description: 'Generate 5 anime images based on the input text.',
        type: 1, 
        options: [
            {
                name: 'prompt',
                type: 3, 
                description: 'What should the images contain?',
                required: true,
            },
            {
                name: 'negative_prompt',
                type: 3, 
                description: 'What should the images not contain?',
                required: true,
            },
            {
                name: 'sampler',
                type: 3, 
                description: 'What sampler?',
                required: true,
                choices: [
                    {
                        name: 'DPM++ 2s Ancestral',
                        value: 'k_dpmpp_2s_ancestral',
                    },
                    {
                        name: 'Euler (Standard)',
                        value: 'k_euler',
                    },
                ],
            },
            {
                name: 'model',
                type: 3, 
                description: 'What model?',
                required: true,
                choices: [
                    {
                        name: 'V4.5 Full',
                        value: 'nai-diffusion-4-5-full',
                    },
                    {
                        name: 'V4.5 Curated',
                        value: 'nai-diffusion-4-5-curated',
                    },
                ],
            },
            {
                name: 'steps',
                type: 4, 
                description: 'How many steps?',
                required: true,
                choices: [
                    {
                        name: '15 steps',
                        value: '15',
                    },
                    {
                        name: '28 steps',
                        value: '28',
                    },
                ],
            },
            {
                name: 'resolution',
                type: 3, 
                description: 'What resolution?',
                required: true,
                choices: [
                    {
                        name: '832x1216',
                        value: '832x1216',
                    },
                    {
                        name: '512x512',
                        value: '512x512',
                    },
                    {
                        name: '1216x832',
                        value: '1216x832',
                    },
                    {
                        name: '1024x1024',
                        value: '1024x1024',
                    },
                ],
            },
        ]
    },  
    {
        name: 'vibetransfer',
        description: 'Vibe transfer image based on the input text.',
        type: 1, 
        options: [
            {
                name: 'prompt',
                type: 3, 
                description: 'What should the image contain?',
                required: true,
            },
            {
                name: 'negative_prompt',
                type: 3, 
                description: 'What should the image not contain?',
                required: true,
            },
            {
                name: 'sampler',
                type: 3, 
                description: 'What sampler?',
                required: true,
                choices: [
                    {
                        name: 'DPM++ 2s Ancestral',
                        value: 'k_dpmpp_2s_ancestral',
                    },
                    {
                        name: 'Euler (Standard)',
                        value: 'k_euler',
                    },
                ],
            },
            {
                name: 'model',
                type: 3, 
                description: 'What model?',
                required: true,
                choices: [
                    {
                        name: 'V4.5 Full',
                        value: 'nai-diffusion-4-5-full',
                    },
                    {
                        name: 'V4.5 Curated',
                        value: 'nai-diffusion-4-5-curated',
                    },
                ],
            },
            {
                name: 'steps',
                type: 4, 
                description: 'How many steps?',
                required: true,
                choices: [
                    {
                        name: '15 steps',
                        value: '15',
                    },
                    {
                        name: '28 steps',
                        value: '28',
                    },
                ],
            },
            {
                name: 'resolution',
                type: 3, 
                description: 'What resolution?',
                required: true,
                choices: [
                    {
                        name: '832x1216',
                        value: '832x1216',
                    },
                    {
                        name: '512x512',
                        value: '512x512',
                    },
                    {
                        name: '1216x832',
                        value: '1216x832',
                    },
                    {
                        name: '1024x1024',
                        value: '1024x1024',
                    },
                ],
            },
            {
                name: 'reference_information_em',
                type: 10, 
                description: 'referece strength 0-1 (0.5)',
                required: true,
                choices: [
                    {
                        name: '0,6',
                        value: 0.6,
                    },
                    {
                        name: '0,8',
                        value: 0.8,
                    },
                    {
                        name: '1',
                        value: 1,
                    },
                ],
            },
            {
                name: 'reference_image_multiple',
                type: 11, 
                description: 'Picture uploaded by the user.',
                required: true,
            },
            {
                name: 'reference_strength_multiple',
                type: 10, 
                description: 'Strength of the reference multiple times 0-1 (0.5)',
                required: true,
                choices: [
                    {
                        name: '0,6',
                        value: 0.6,
                    },
                    {
                        name: '0,8',
                        value: 0.8, 
                    },
                    {
                        name: '1',
                        value: 1,
                    },
                ],
            }
        ]
    },
    {
        name: 'help',
        description: 'Get help with the bot.',
        type: 1, 
    }
];

rest.put(Routes.applicationGuildCommands(clientId, GUILD_ID), { body: commands })
  .then(() => console.log('Created slash-parameters.'))
  .catch(console.error);

client.login(discordBotToken).catch(console.error);
