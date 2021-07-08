const rate = require('./rate');

module.exports = {
  name: 'ocr',
  description: `Optical Character Recognition Command`,
  args: false,
  execute(message, args) {

    //Global parameters
    const Discord = require('discord.js');
    const fs = require('fs');
    const ocrSpace = require('ocr-space-api-wrapper')
    const {
      apikey
  } = require('../config.json');
    var user = message.author.id
    var statname = ["HP+", "ATK+", "DEF+", "CRIT Rate+", "CRIT DMG+", "Energy Recharge+", "Elemental Mastery+"]
    var selection = []
    var maxpossible = ''
    var mastermessage = ''

    //Calcualtion parameter
    var sum = 0
    var roll = [0, 0]
    var range = [0.50, 0.49, 0.050, 0.049]
    var outcome = []
    var rounding = 0
    var found = false

    //Library of substats
    var substat = {
      "HP": [209.13, 239.00, 268.88, 298.75],
      "ATK": [13.62, 15.56, 17.51, 19.45],
      "DEF": [16.20, 18.52, 20.83, 23.15],
      "HP%": [4.08, 4.66, 5.25, 5.83],
      "ATK%": [4.08, 4.66, 5.25, 5.83],
      "DEF%": [5.10, 5.83, 6.56, 7.29],
      "EM": [16.32, 18.65, 20.98, 23.31],
      "ER%": [4.53, 5.18, 5.83, 6.48],
      "CR%": [2.72, 3.11, 3.50, 3.89],
      "CDMG%": [5.44, 6.22, 6.99, 7.77]
    }

    //Functions
    //Calculate combinations
    function combination(stats, roll, index) {
      var combo = [];
      var recursiveABC = function (singleSolution) {

        if (singleSolution.length > roll[index] - 1) {
          combo.push(singleSolution);
          return;
        }
        for (let i = 0; i < stats.length; i++) {
          recursiveABC(singleSolution.concat([stats[i]]));
        }
      };
      recursiveABC([]);
      return combo;
    };

    function analysis(args) {

      //Determine rolls
      var entry = Object.keys(substat).find(p => p == args[0]);
      if (entry != undefined) {
        var stats = substat[entry]

        //Check if displayed stat has period or not, adjust range
        if (args[0] == "HP" || args[0] == "ATK" || args[0] == "DEF" || args[0] == "EM") {
          range = [range[0], range[1]]
          rounding = 0
        } else {
          range = [range[2], range[3]]
          rounding = 1
        }

        //Calculate from args[1]
        args[1] = parseFloat(args[1])

        for (let i = 1; sum + stats[0] < args[1] + range[1] && i < 7; i++) {
          sum += stats[0]
          roll = [i - 1, i]
        }

        if (roll[0] == 0) {
          roll[0] = 1
        }

        //Store values for both possible rolls and remove out of bounds + duplicates after rounding
        outcome = [combination(stats, roll, 0), combination(stats, roll, 1)]
        for (let i = 0; i < outcome.length; i++) {
          for (let j = 0; j < outcome[i].length; j++) {
            outcome[i][j] = outcome[i][j].reduce((pv, cv) => pv + cv, 0)
            if ((outcome[i][j] > args[1] + range[1]) || (outcome[i][j] < args[1] - range[0])) {
              outcome[i][j] = 0
            }
          }
          outcome[i] = outcome[i].filter(val => val != 0)

          let x = 0
          while (x < outcome[i].length) {
            outcome[i][x] = parseFloat(outcome[i][x].toFixed(rounding));
            x++
          }

          var uniqueoutcome = [];
          uniqueoutcome[i] = []
          outcome[i].forEach((c) => {
            if (!uniqueoutcome[i].includes(c)) {
              uniqueoutcome[i].push(c);
            }
          });
          if (uniqueoutcome[i].includes(args[1])) {
            maxpossible = parseFloat((substat[entry][3] * roll[i]).toFixed(rounding));
            mastermessage += "The substat **" + args[0] + "** has **" + roll[i] + "** rolls in total! Max possible stat is **" + maxpossible + "** (" + Math.round(((args[1] - roll[i] * substat[entry][0].toFixed(rounding))/(maxpossible - roll[i] * substat[entry][0].toFixed(rounding)))*100) + "%).\n"
            found = true
            return;
          }
        }

        if (found == false) {
          mastermessage += "The substat **" + args[0] + "** with the value **" + args[1] + "** is impossible to construct or OCR failed to recognise the characters!\n"
        }
        found = false
      } else {
        message.channel.send("Stat not found!")
        return;
      }
    }

    //Store attachment
    try {
      message.attachments.forEach(attachment => {
        const url = attachment.url;
        async function main() {
          try {
            // Apply OCR by external API
            const res1 = await ocrSpace(url, {
              apiKey: apikey,
              isTable: true,
              OCREngine: 2
            })
            var analysedtext = res1.ParsedResults[0].ParsedText
            console.log(analysedtext)
          } catch (error) {
            console.log(error)
          }
          
          analysedtext = analysedtext.split("\n")
    
          for (each in analysedtext) {
            analysedtext[each] = analysedtext[each].replace(/\t/g, '')
            analysedtext[each] = analysedtext[each].replace(/\r/g, '')

            for (every in statname) {
              if (analysedtext[each].includes(statname[every])) {

                switch (statname[every]) {
                  case "HP+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    if (analysedtext[each].includes("%")) {
                      analysedtext[each] = analysedtext[each].replace(/%/g, '')
                      selection.push(["HP%", analysedtext[each]])
                    } else {
                      selection.push(["HP", analysedtext[each]])
                    }
                    break;

                  case "ATK+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    if (analysedtext[each].includes("%")) {
                      analysedtext[each] = analysedtext[each].replace(/%/g, '')
                      selection.push(["ATK%", analysedtext[each]])
                    } else {
                      selection.push(["ATK", analysedtext[each]])
                    }
                    break;

                  case "DEF+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    if (analysedtext[each].includes("%")) {
                      analysedtext[each] = analysedtext[each].replace(/%/g, '')
                      selection.push(["DEF%", analysedtext[each]])
                    } else {
                      selection.push(["DEF", analysedtext[each]])
                    }
                    break;

                  case "CRIT Rate+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    analysedtext[each] = analysedtext[each].replace(/%/g, '')
                    selection.push(["CR%", analysedtext[each]])
                    break;

                  case "CRIT DMG+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    analysedtext[each] = analysedtext[each].replace(/%/g, '')
                    selection.push(["CDMG%", analysedtext[each]])
                    break;

                  case "Energy Recharge+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    analysedtext[each] = analysedtext[each].replace(/%/g, '')
                    selection.push(["ER%", analysedtext[each]])
                    break;

                  case "Elemental Mastery+":
                    analysedtext[each] = analysedtext[each].substring(analysedtext[each].lastIndexOf("+") + 1)
                    selection.push(["EM", analysedtext[each]])
                    break;
                }
              }
            }
          }
          for (let idx = 0; idx < selection.length; idx++) {
            sum = 0
            roll = [0, 0]
            range = [0.50, 0.49, 0.050, 0.049]
            outcome = []
            rounding = 0
            found = false
            analysis(selection[idx])
          }
          
          message.channel.send(mastermessage || "Unidentified image!")
          
        }
        main()
      });
    } catch (error) {
      console.log(error)
      message.channel.send("No attachment provided!")
      return;
    }
  }
};