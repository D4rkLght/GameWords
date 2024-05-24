const words = [
    'path', 'star', 'courage', 'brave', 'thorns',
    'luck', 'adversity', 'fall', 'rise', 'goal', 'result'
];

const definitions = [
    'a way of life, conduct, or thought',
    'a natural luminous body visible in the sky especially at night',
    'mental or moral strength to venture, persevere, and withstand danger, fear, or difficulty', 
    'having or showing mental or moral strength to face danger, fear, or difficulty : having or showing courage',
    'something that causes distress or irritation', 
    'a force that brings good fortune.', 
    'a state or instance of serious or continued difficulty or misfortune',
    'to drop oneself to a lower position', 
    'to move upward ', 
    'the score resulting from such an act', 
    'something obtained by calculation or investigation'
];

let selectedWord = null;
let selectedDefinition = null;
let score = 0;

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

window.onload = function() {
    const wordsList = document.getElementById('words-list');
    const definitionsList = document.getElementById('definitions-list');

    // Shuffle words and definitions
    const shuffledWords = shuffle([...words]);
    const shuffledDefinitions = shuffle([...definitions]);

    shuffledWords.forEach((word, index) => {
        const wordItem = document.createElement('li');
        wordItem.innerText = word;
        wordItem.dataset.index = words.indexOf(word); // Original index
        wordItem.addEventListener('click', () => selectWord(wordItem));
        wordsList.appendChild(wordItem);
    });

    shuffledDefinitions.forEach((definition, index) => {
        const definitionItem = document.createElement('li');
        definitionItem.innerText = definition;
        definitionItem.dataset.index = definitions.indexOf(definition); // Original index
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
