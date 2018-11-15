const STOP_WORDS = [" ", "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
const chalk = require('chalk');
const sentiment = require('node-sentiment');
const natural = require('natural');
const Table = require('cli-table');

const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");


const chat = require('./577820122.json');

var table = new Table();

const lastMessage = chat[0];

chat.reverse();

let allMessages = '';
let allMessagesArr = [];

let votes = {};
let words = {}

for (let i = 0; i < chat.length; i++) {
    let c = chat[i].message;
    allMessages += c;
    allMessagesArr.push(c);
    let s = sentiment(c, 'en');

    if (votes[s.vote]) {
        votes[s.vote] += 1
    } else {
        votes[s.vote] = 1
    }

    let _words = c.split(' ');

    for (let j = 0; j < _words.length; j++) {
        let w = _words[j].toLowerCase().trim();
        if (STOP_WORDS.indexOf(w) < 0 && w) {
            if (words[w]) {
                words[w] += 1
            } else {
                words[w] = 1
            }
        }
    }
}

table.push([chalk.blue.bold('Total messages'), chat.length],
    [chalk.blue.bold('Last message'), lastMessage.message],
    [chalk.blue.bold('Last message Timestamp'), (new Date(lastMessage.date * 1000)).toLocaleString()],
    [chalk.blue.bold('Positive Messages'), votes.positive],
    [chalk.blue.bold('Neutral Messages'), votes.neutral],
    [chalk.blue.bold('Negative Messages'), votes.negative]
);

console.log(table.toString());

var table = new Table({
    head: ['S.No.', 'Word', 'Count']
});

var sortable = [];
var ctr = 1;
for (var w in words) {
    sortable.push([w, words[w]]);
}

sortable.sort(function(a, b) {
    return b[1] - a[1];
});

var j = 1;
for (var i = 0; i < 10; i++) {
    table.push([j++, sortable[i][0], sortable[i][1]])
}

console.log(table.toString());