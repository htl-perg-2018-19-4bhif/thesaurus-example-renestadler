//Error when to few arguments available
if (process.argv.length <= 2) {
    console.error("Please specify words");
} else if (process.argv.length === 3 && process.argv[2] === "-i") { //Interactive Program
    let matched: boolean;
    //Init the standard input
    var readline = require('readline');
    var stdin = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    console.log("Please enter a word to search for:");
    stdin.on('line', function (input) {
        if(input==="\\q"){
            process.exit(0);
        }
        matched = false;
        //Init the File Reader
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('openthesaurus.txt')
        });
        //Read Line by Line
        lineReader.on('line', function (line: string) {
            //Does Line contains the word?
            if (line.indexOf(input) != -1) {
                matched = true;
                let synonyms: string[] = line.split(";");
                //Print the results
                for (let j = 0; j < synonyms.length; j++) {
                    if (synonyms[j].indexOf(input) != -1 && synonyms[j] !== input) {
                        console.log(synonyms[j].replace(input, "(" + input + ")") + ":");
                        for (let i = 0; i < synonyms.length; i++) {
                            if (i != j) {
                                console.log("- " + synonyms[i]);
                            }
                        }
                        break;
                    } else if (synonyms[j].indexOf(input) != -1 && synonyms[j] === input) {
                        console.log(input + ":");
                        for (let i = 0; i < synonyms.length; i++) {
                            if (i != j) {
                                console.log("- " + synonyms[i]);
                            }
                        }
                        break;
                    }
                }
            }
        });
        //Check for Matches before end 
        lineReader.on('close', function () {
            if (matched === false) {
                console.error("No matches found");
            }
            console.log("Please enter a word to search for:");
        });
    })
} else { //Standard Program
    const words: string[] = [];     //Inputed Words
    const matched: boolean[] = [];  //Has match occured (for every inputed word)
    //Add words (and if they're matched)
    for (let i = 2; i < process.argv.length; i++) {
        words.push(process.argv[i]);
        matched.push(false);
    }
    //Init the lineReader
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('openthesaurus.txt')
    });
    //Read Line by Line
    lineReader.on('line', function (line: string) {
        for (let i = 0; i < words.length; i++) {
            if (line.indexOf(words[i]) != -1) {
                matched[i] = true;
                let synonyms: string[] = line.split(";");
                let output: string;
                //Getting to know, if the inputed expression is part of the string or exactly the string
                //If it's only a part, I surround it with ()
                //Additionally, print the synonyms for the found word
                for (let j = 0; j < synonyms.length; j++) {
                    if (synonyms[j].indexOf(words[i]) != -1 && synonyms[j] !== words[i]) {
                        output = synonyms[j].replace(words[i], "(" + words[i] + ")") + ":";
                        for (let k = 0; k < synonyms.length; k++) {
                            if (k != j) {
                                output += "\n" + synonyms[k];
                            }
                        }
                        break;
                    } else if (synonyms[j].indexOf(words[i]) != -1 && synonyms[j] === words[i]) {
                        output = words[i] + ":";
                        for (let k = 0; k < synonyms.length; k++) {
                            if (k != j) {
                                output += "\n" + synonyms[k];
                            }
                        }
                        break;
                    }
                }
                //Print everything
                console.log(output);
            }
        }
    });

    //Check for Matches before end (for every single word)
    lineReader.on('close', function () {
        for (let j = 0; j < words.length; j++) {
            if (matched[j] === false) {
                console.error(words[j] + ":\nNo matches found");
            }
        }
    });
}