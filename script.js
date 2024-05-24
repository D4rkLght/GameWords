const words = [
    'Algorithm', 'Binary', 'Compiler', 'Database', 'Encryption',
    'Firewall', 'Gigabyte', 'Hyperlink', 'Internet', 'JavaScript'
];

const definitions = [
    'A process or set of rules to be followed in calculations or other problem-solving operations.',
    'A base-2 numeral system which uses only two binary digits, 0 and 1.',
    'A program that converts instructions into a machine-code or lower-level form so that they can be read and executed by a computer.',
    'A structured set of data held in a computer, especially one that is accessible in various ways.',
    'The process of converting information or data into a code, especially to prevent unauthorized access.',
    'A part of a computer system or network that is designed to block unauthorized access while permitting outward communication.',
    'A unit of information equal to one billion (10^9) bytes.',
    'A link from a hypertext document to another location, activated by clicking on a highlighted word or image.',
    'A global computer network providing a variety of information and communication facilities, consisting of interconnected networks using standardized communication protocols.',
    'A high-level, dynamic, untyped, and interpreted programming language.'
];

let selectedWord = null;
let selectedDefinition = null;
let score = 0;

window.onload = function() {
    const wordsList = document.getElementById('words-list');
    const definitionsList = document.getElementById('definitions-list');

    words.forEach((word, index) => {
        const wordItem = document.createElement('li');
        wordItem.innerText = word;
        wordItem.dataset.index = index;
        wordItem.addEventListener('click', () => selectWord(wordItem));
        wordsList.appendChild(wordItem);
    });

    definitions.forEach((definition, index) => {
        const definitionItem = document.createElement('li');
        definitionItem.innerText = definition;
        definitionItem.dataset.index = index;
        definitionItem.addEventListener('click', () => selectDefinition(definitionItem));
        definitionsList.appendChild(definitionItem);
    });
}

function selectWord(wordItem) {
    if (wordItem.classList.contains('incorrect') || wordItem.classList.contains('matched')) return;
    clearSelections();
    wordItem.classList.add('selected');
    selectedWord = wordItem;
    checkMatch();
}

function selectDefinition(definitionItem) {
    if (definitionItem.classList.contains('incorrect') || definitionItem.classList.contains('matched')) return;
    clearSelections();
    definitionItem.classList.add('selected');
    selectedDefinition = definitionItem;
    checkMatch();
}

function clearSelections() {
    document.querySelectorAll('li').forEach(item => {
        item.classList.remove('selected');
    });
}

function checkMatch() {
    if (selectedWord && selectedDefinition) {
        if (selectedWord.dataset.index === selectedDefinition.dataset.index) {
            selectedWord.classList.add('hidden');
            selectedDefinition.classList.add('hidden');
            score++;
        } else {
            selectedWord.classList.add('incorrect');
            selectedDefinition.classList.add('incorrect');
        }

        selectedWord = null;
        selectedDefinition = null;

        checkGameOver();
    }
}

function checkGameOver() {
    const allWords = document.querySelectorAll('#words-list li');
    const allDefinitions = document.querySelectorAll('#definitions-list li');

    const noMoreClicksPossible = [...allWords].every(item => item.classList.contains('incorrect') || item.classList.contains('hidden')) &&
                                 [...allDefinitions].every(item => item.classList.contains('incorrect') || item.classList.contains('hidden'));

    if (noMoreClicksPossible) {
        document.getElementById('result').innerText = `Game Over! You matched ${score} words correctly.`;
        SendMessageBot(score);
    }
}

function SendMessageBot(score) {
    const searchString = new URLSearchParams(window.location.search);
    const chat_id = searchString.get('chat_id');
    const token = searchString.get('token');
    window.post = function(url, data) {
        return fetch(url, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    url = "https://api.telegram.org/bot" + token + "/sendMessage"
    text = `You have scored ${score}★`
    keyboard = {"inline_keyboard": [[{"text": "Get reward", "callback_data": `game_${score}`}]]}
    data = {'chat_id': chat_id, 'text': text, 'reply_markup': keyboard}
    post(url, data);
}
