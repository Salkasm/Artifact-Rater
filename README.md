# Welcome to Artifact Rater, a Genshin Impact Discord Bot!

Heya, the name I go by online is **Salkasm** and I am an autodidact javascript programmer. I have a keen interest in developing Discord bots to aid players in games, namely Genshin Impact and Dead by Daylight. My code is in no way optimised and I am still learning (what programmer isn't anyways) and I am open to any critique to optimise my code.

This bot is called **Artifact Rater** and is dedicated to Genshin Impact, attempting to rate your artifacts and determining their value to given builds. A copy of the bot can be downloaded here and used freely. The bot can be used in a **server** and also in **DM**s. The current version is **1.4.1**.

I have split up this wall of text into a few sections:
- **Information on data** (Credits)
- **Rating system** (how the rating system works)
- **Commands** (what commands the bot features and how to use them)
- **Setting up your own bot** (quick install guide on how to run the bot)
- **Contacting me** (in case you would like to give me feedback)
- **Final words** (some final words by me)


## Information on data

Commands analysing artifacts work for any **4**:star: and **5**:star: artifacts. Artifacts of lower tiers are not supported. I claim no ownership on any of the sources mentioned below.
- The **builds** themselves are derived off the [Genshin Impact Helper Team's Google sheet](https://docs.google.com/spreadsheets/d/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI).
- The **possible substats** are taken from [Genshin Impact Fandom](https://genshin-impact.fandom.com/wiki/Artifacts/Stats) as the are much more accurate than the values displayed in-game (rounding).
- The **portraits** as well as **information on unreleased characters** are taken from [Honey Impact](https://genshin.honeyhunterworld.com/).
- The **optical character recognition software** used is by [OCRAPI](https://ocr.space/OCRAPI). To run your own bot, you will require to acquire your own API-key (free).

I want to thank the people running these websites for all the information provided and technology shared to make this bot happen. :clap:

## Rating system

#### The Rating

The **rating system** is something I have developed to rate artifacts according to their usability on characters in Genshin Impact. I will go over what the parameters are and how artifacts are judged according to their substats. Most characters have around **1-4 desirable substats**, for example:
- A **Main DPS** tends to favour **CRIT Rate%**, **CRIT DMG%** and **ATK%**.
- An **Elemental Mastery Build** tends to favour only **Elemental Mastery** and **Energy Recharge%**.

The idea is to determine how valuable an artifact is according to their **set**, **main stat** and **substats**. The formula used is the following:

<img src="https://render.githubusercontent.com/render/math?math=Rating(DR) = \frac {DS + DR}{DS + r}">

**Rating** is obviously the rating of the artifact, given in a fraction. **r** is the rarity of the artifact, a **5**:star: therefore has the value **5** as it can upgrade stats **5** additional times starting from +0 levels. **DS** is the amount of desired substats, they are all treated equally. **DR** is the amount of rolls that went into any of the desired substats, this can at max be **5** for a **5**:star: artifact.

The bot is configured with these conditions:
- Every character has at least **2** desired substats and up to **3** desired substats.
- If a character has a **fourth valuable substat** (called **substitute substat**) it will only be used **if** the main stat takes up one of the desired substats (as it then becomes impossible to be a substat, keeping the amount of substats at **3** at all times).
- If a **main stat is also represented in the pool of desired substats** for that character and there is no substitute substat, the amount of substats is **reduced** by **1**.

#### Example to explain the output
In this example I will run through the information **acquired and requried** by the bot.

![alt text](https://i.gyazo.com/98bfb0744fba8a7e6ba80e236b1a8193.png)
The image must include:
- The **name** of the main stat, the **value** of the main stat
- All **substats**
- The **set's name** (green version)

The **version in the bag** works best, the bot can however also detect **equipped artifacts** (promiscuous background may cause misinterpretation by the OCR).
In the first line, it will tell you what **rarity** was detected (in our case, a **5** :star: artifact).
The next segment will reproduce the **substats**, their **displayed value** and calculates the **amount of rolls** in that particular substat (including the initial roll). It will then calculate the **max possible value** of that substat in regards to the amount of rolls and a **percentage** on how good your substat value fairs against this value (**100%** being all rolls had max rolls, **0%** with all rolls being the min rolls).

#### The Fit

The final segment will test this **artifact against a database** of builds to see **who** it would fit and **how well** it would fit them. It will show the **Rating** (as explained before), give a comment on the **fit** ("acceptably" for **1** substat, "well" for **2** substats and "very well" for **3** substats), the **character** and its **build name** and reproduce the **desired substats** (matching substats in **bold**).

#### Advatages and disadvatages


|Advantages                              |Disadvatages                          |
|----------------------------------------|--------------------------------------|
|- Objective rating of the artifact      |- All substats are of equal value     |
|- Easy fitting to builds                |- Functional for only 2 to 3 substats |
|- Shows the quality of the substat      |- No regard for greater scope of stats|
|- Takes sets into account               |- Limited to only a few sets per build|


## Commands

I will go over all the featured commands of this bot. I will assume you have understood the rating system by now. Arguments given in [] are necessary, arguments given in () are optional. "**;**" is the default prefix.

#### check

> ;check [substat name] [substat value]

The **check** command will calculate the amount of rolls in a singular substat. Make sure to include the **%** in the substat's name, **NOT** the value. Remove the **%** from the value if it exists. Below is a list of the substat names the bot acknowledges:

|In-game |Bot CMD |        |In-game          |Bot CMD |
|--------|--------|--------|-----------------|--------|
|ATK     |ATK     |        |HP(%)            |HP%     |
|DEF     |DEF     |        |Elemental Mastery|EM      |
|HP      |HP      |        |Energy Recharge  |ER%     |
|ATK(%)  |ATK%    |        |CRIT Rate        |CR%     |
|DEF(%)  |DEF%    |        |CRIT DMG         |CDMG%   |

An example is given below:
> ;check ER% 11.7

Will calculate the amount of rolls that went into the substat Energy Recharge% according to the displayed value 11.7%.

#### rate

> ;rate [artifact type] ("all")

The **rate** command will give a comprehensive output of an artifact. It will display the **quality of all substats** (amount of rolls that went into it, quality of the rolls themselves), the **rating across all substats** and the **fit** for any character. Activating the parameter "**all**" will ignore the set type. Upload the image in the same instance of using the command. The minimal information required is given below:

![alt text](https://i.gyazo.com/d30ecf17b7f0a20f15376f8ce4bd840f.png)![alt text](https://i.gyazo.com/08938dcbbe395ad057a02c91a4660de5.png)
The first example is much less prone to mistakes made by the OCR. It is recommended to **NOT** give the bot more information than this, as it increases the likelihood of an error. Any information less than this will result into an error (flowers and plumes can make do without the main stat). A list of artifact types is given below:

|In-game                             |Bot CMD |
|------------------------------------|--------|
|flower                              |flower  |
|feather, plume                      |plume   |
|time piece, sands, watch, clock     |sands   |
|cup, goblet, grail                  |goblet  |
|crown, headpiece, circlet, hat, mask|circlet |

An example is given below:
> ;rate flower all

Will analyse the uploaded image of a flower-type artifact and checking fits for character and their build **ignoring** the set.

#### profile

> ;profile [character name]

The **profile** command will display the database entry of a character. The entry includes the different **builds**, the recommended **weapons**, the recommended **sets**, the recommended **main stats** on the sands, goblet, circlet and the desired **substats**.
For the weapons, the best in slot **(BiS) is displayed**. If it happens to be a **5**:star: weapon, the BiS **4**:star: weapon is additionally displayed. If the additional weapon happens to be a Battle Pass weapon, an additional BiS **4**:star: non-BP weapon is displayed. If weapons share a BiS slot together, then all of them in that slot are given.
For the sets, the **BiS set is given along with its second BiS set**, **if** it is not a worse version of the BiS set (as in different set entirely).
An example is given below:
> ;profile Yoimiya

![alt text](https://i.gyazo.com/867b117319be718023adb25a2e3bb6fc.png)
#### help

> help

The **help** command will give information on all the commands. React with the appropriate emotes to navigate to the command.

#### version

> version

The **version** command will show the bots version along with some credits.

#### ping

> ping

The **ping** command checks the bots responsiveness.

## Setting up your own bot

This section will quickly go over how to set-up your own bot. To clone an instance of Artifact Rater into your directory, use the git command. The bot is run in Node.js.
> git clone [https://github.com/Salkasm/Artfact-Rater.git](https://github.com/Salkasm/Artfact-Rater.git)

You will be provided with most files to run the bot. However you will additionally have to:
- install the node modules: **discord.js**, **es7**, **jquery**, **node-fetch**, **ocr-space-api-wrapper**, **reaction-core**. This list can also be found in the package.json file.
- rename the **config-example.json to config.json**
- acquire your own **DiscordBot-token** (from the Discord Developer Portal) and add that in **token** in the config.json file
- acquire your own **OCRAPI-key** and add that in **apikey** in the config.json file

You can change the **prefix** in the config.json file as well. The bot can be run with the command below:
> node .

## Contacting me

The most efficient way to contact me is by **Discord**, this is my tag: **Salkasm#4688**. Make sure to state why you have contacted me as I tend to ignore messages only containing "hi"" or "help".

## Final words

You made it to the end of my wall of text :tada:.
I wish you a lot of fun with the bot and best of luck with artifact rolls :heart:!

