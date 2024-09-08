// Valores iniciais e configurações
const initialMealCount = 1; // Valor inicial para refeições
const maxMeals = 20; // Máximo de refeições
const maxFoodsPerMeal = 15; // Máximo de alimentos por refeição
const maxQuantity = 9999; // Quantidade máxima de alimento que pode ser adicionado
const popupCooldown = 5000; // Tempo de cooldown para pop-ups em milissegundos
const initialFoodCount = 0; // Valor inicial para o estoque de alimentos disponíveis

// Dados dos alimentos e calorias
const foodCalories = {
    'Maçã': 52,
    'Banana': 89,
    'Laranja': 47,
    'Pera': 39,
    'Uva': 69,
    'Manga': 60,
    'Meloa': 34,
    'Pêssego': 39,
    'Kiwi': 61,
    'Morangos': 32,
    'Cereja': 50,
    'Framboesa': 52,
    'Amora': 43,
    'Goiaba': 68,
    'Maracujá': 97,
    'Abacaxi': 50,
    'Papaya': 43,
    'Coco': 354,
    'Abacate': 160,
    'Melancia': 30,
    'Melão': 34,
    'Laranja': 47,
    'Ameixa': 46,
    'Limão': 29,
    'Tomate': 18,
    'Pepino': 16,
    'Cenoura': 41,
    'Beterraba': 43,
    'Espinafre': 23,
    'Brócolis': 34,
    'Repolho': 25,
    'Alface': 15,
    'Pimentão': 20,
    'Berinjela': 25,
    'Abobrinha': 17,
    'Batata-doce': 86,
    'Batata': 77,
    'Cebola': 40,
    'Alho': 149,
    'Champignon': 22,
    'Queijo': 402,
    'Iogurte': 59,
    'Leite': 42,
    'Ovo': 155,
    'Peito de frango': 165,
    'Carne de vaca': 250,
    'Pescado': 206,
    'Atum': 184,
    'Salmão': 206,
    'Arroz branco': 130,
    'Feijão': 127,
    'Macarrão': 131,
    'Batata frita': 312,
    'Pizza': 266,
    'Hambúrguer': 250
};

// Seleciona os elementos do DOM
const mealCountElement = document.getElementById('mealCount');
const foodCountElement = document.getElementById('foodCount');
const mealSelector = document.getElementById('mealSelector');
const foodSelector = document.getElementById('foodSelector');
const foodQuantityInput = document.getElementById('foodQuantity');
const totalCaloriesElement = document.getElementById('totalCalories');
const increaseMealBtn = document.getElementById('increaseMealBtn');
const decreaseMealBtn = document.getElementById('decreaseMealBtn');
const increaseFoodBtn = document.getElementById('increaseFoodBtn');
const decreaseFoodBtn = document.getElementById('decreaseFoodBtn');
const addFoodBtn = document.getElementById('addFoodBtn');
const mealsContainer = document.getElementById('mealsContainer');

// Armazena os alimentos adicionados para cada refeição
let mealsData = {}; // Dados dos alimentos por refeição
let mealCount = initialMealCount; // Contador de refeições
let availableFoodCount = initialFoodCount; // Contador de alimentos no estoque global

// Controle de cooldown para pop-ups
const popupCooldownTracker = {
    addMeal: 0,
    removeMeal: 0,
    addFood: 0,
    removeFood: 0
};

// Armazena os pop-ups ativos para controle
const activePopups = [];

// Função para mostrar uma mensagem de pop-up
function showPopupMessage(message, type = 'success') {
    const now = Date.now();

    if (now - popupCooldownTracker[type] < popupCooldown) {
        return; // Ignora o pop-up se ainda estiver no cooldown
    }

    // Atualiza o tempo de cooldown
    popupCooldownTracker[type] = now;

    // Se já há o máximo de pop-ups visíveis, remove o mais antigo
    if (activePopups.length >= 3) {
        const oldestPopup = activePopups.shift(); // Remove o pop-up mais antigo
        oldestPopup.remove(); // Remove o pop-up do DOM
    }

    // Cria um novo pop-up
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = 'popup-message';
    popup.style.backgroundColor = type === 'error' ? 'red' : 'green';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.position = 'fixed';
    popup.style.left = '10px';
    popup.style.zIndex = '1000';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.5s, transform 0.5s';

    // Adiciona o pop-up ao DOM
    document.body.appendChild(popup);
    activePopups.push(popup);

    // Ajusta a posição dos pop-ups
    const popupCount = activePopups.length;
    popup.style.bottom = `${10 + (popupCount - 1) * 60}px`;

    // Mostra o pop-up com uma animação
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
    }, 10);

    // Remove o pop-up após 5 segundos
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(20px)';
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 5000);
}

// Função para atualizar o contador de refeições
function updateMealCount() {
    mealCountElement.textContent = mealCount;
    populateMealSelector();
    updateMealsContainer();
    updateAvailableFoodForMeal(); // Atualiza o contador de alimentos para a refeição selecionada
}

// Função para adicionar uma refeição
increaseMealBtn.addEventListener('click', () => {
    if (mealCount < maxMeals) {
        mealCount++;
        mealsData[mealCount] = []; // Adiciona uma nova refeição com dados vazios
        updateMealCount();
        showPopupMessage('Refeição adicionada com sucesso.', 'addMeal');
    }
});

// Função para remover a última refeição
function removeLastMeal() {
    if (mealCount <= 1) {
        showPopupMessage('Não é possível remover mais refeições.', 'error');
        return;
    }

    const lastMealNumber = mealCount;

    // Remove a última refeição dos dados
    delete mealsData[lastMealNumber];
    mealCount--;

    // Atualiza o contêiner de refeições e o total de calorias
    updateMealCount();

    // Mostra uma mensagem de sucesso
    showPopupMessage('Última refeição removida com sucesso.', 'removeMeal');
}

// Adiciona um evento ao botão de remover refeição
decreaseMealBtn.addEventListener('click', () => {
    removeLastMeal();
});

// Função para atualizar o contador de alimentos disponíveis para a refeição selecionada
function updateAvailableFoodForMeal() {
   foodCountElement.textContent = availableFoodCount;
   
}
// Função para atualizar o contador de alimentos disponíveis
function updateFoodCount() {
    foodCountElement.textContent = availableFoodCount;
}

// Função para adicionar um alimento ao estoque
increaseFoodBtn.addEventListener('click', () => {
    availableFoodCount++;
    updateFoodCount();
    showPopupMessage('Alimento adicionado ao estoque.', 'addFood');
});

// Função para remover um alimento do estoque
decreaseFoodBtn.addEventListener('click', () => {
    if (availableFoodCount > 0) {
        availableFoodCount--;
        updateFoodCount();
        showPopupMessage('Alimento removido do estoque.', 'removeFood');
    } else {
        showPopupMessage('Não há alimentos suficientes no estoque para remover.', 'error');
    }
});

// Função para adicionar um alimento à refeição selecionada
addFoodBtn.addEventListener('click', () => {
    const selectedMeal = mealSelector.value;
    const selectedFood = foodSelector.value;
    const quantity = parseFloat(foodQuantityInput.value) || 0;

    if (!selectedMeal || !selectedFood) {
        showPopupMessage('Por favor, selecione uma refeição e um alimento.', 'error');
        return;
    }

    if (quantity <= 0 || quantity > maxQuantity) {
        showPopupMessage('Quantidade inválida. Insira um valor entre 1 e 9999.', 'error');
        return;
    }

    const mealItems = mealsData[selectedMeal] || [];
    if (mealItems.length >= maxFoodsPerMeal) {
        showPopupMessage('O número máximo de alimentos por refeição foi alcançado.', 'error');
        return;
    }

    if (availableFoodCount <= 0) {
        showPopupMessage('Não há alimentos disponíveis no estoque.', 'error');
        return;
    }

    // Adiciona o alimento à refeição selecionada
    mealsData[selectedMeal] = mealItems;
    mealsData[selectedMeal].push({
        food: selectedFood,
        quantity: quantity
    });

    availableFoodCount--;
    updateAvailableFoodForMeal();
    updateFoodCount();

    showPopupMessage(`O alimento ${selectedFood} (${quantity}g) foi adicionado.`, 'addFood');
    updateMealsContainer(); // Atualiza o contêiner de refeições
    updateTotalCalories(); // Atualiza o total de calorias
});

// Função para atualizar o contêiner de refeições
function updateMealsContainer() {
    mealsContainer.innerHTML = '';

    for (const mealNumber in mealsData) {
        const mealItems = mealsData[mealNumber] || [];
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.innerHTML = `<h3>Refeição ${mealNumber}</h3>`;
        
        if (mealItems.length > 0) {
            const list = document.createElement('ul');
            mealItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.food}: ${item.quantity}g`;
                list.appendChild(listItem);
            });
            mealDiv.appendChild(list);
        } else {
            mealDiv.innerHTML += '<p>Nenhum alimento adicionado.</p>';
        }

        mealsContainer.appendChild(mealDiv);
    }
}

// Função para calcular o total de calorias
function updateTotalCalories() {
    let totalCalories = 0;
    for (const mealNumber in mealsData) {
        const mealItems = mealsData[mealNumber] || [];
        mealItems.forEach(item => {
            const calories = foodCalories[item.food] || 0;
            totalCalories += (calories * item.quantity) / 100;
        });
    }
    totalCaloriesElement.textContent = totalCalories.toFixed(2) + ' Cal';
}

// Função para popular o seletor de refeições
function populateMealSelector() {
    mealSelector.innerHTML = '';
    for (let i = 1; i <= mealCount; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Refeição ${i}`;
        mealSelector.appendChild(option);
    }

    mealSelector.addEventListener('change', updateAvailableFoodForMeal);
}

// Função para popular o seletor de alimentos
function populateFoodSelector() {
    foodSelector.innerHTML = '';
    for (const food in foodCalories) {
        const option = document.createElement('option');
        option.value = food;
        option.textContent = food;
        foodSelector.appendChild(option);
    }
}

// Inicializa o seletor de refeições e alimentos
populateMealSelector();
populateFoodSelector();

// Inicializa o contêiner de refeições
updateMealsContainer();
updateFoodCount();
updateTotalCalories();
