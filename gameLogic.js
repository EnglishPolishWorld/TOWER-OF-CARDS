// Базовая структура данных
let gameState = {
    playerHp: 100,
    playerMaxHp: 100,
    gold: 20,
    stage: 0,
    backpack: new Array(8).fill(null),
    inventory: []
};

// ФУНКЦИИ СОХРАНЕНИЯ
function saveGame() {
    localStorage.setItem('towerCardsSave', JSON.stringify(gameState));
}

function loadGame() {
    const savedData = localStorage.getItem('towerCardsSave');
    if (savedData) {
        gameState = JSON.parse(savedData);
    } else {
        // Дефолтные стартовые карты если нет сейва
        gameState.backpack[0] = { id:'sword', name:'Меч', icon:'⚔️', dmg:12, speed:1.5, rarity:'common' };
        saveGame();
    }
}

// Пример функции покупки (для shop.html)
function buyCard(cardData, price) {
    if (gameState.gold >= price) {
        const freeSlot = gameState.backpack.indexOf(null);
        if (freeSlot !== -1) {
            gameState.gold -= price;
            gameState.backpack[freeSlot] = cardData;
            saveGame();
            return true;
        } else {
            alert("Нет места в рюкзаке!");
        }
    } else {
        alert("Недостаточно золота!");
    }
    return false;
}

// При загрузке любой страницы восстанавливаем данные
loadGame();
