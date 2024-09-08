let currentInput = 'weight'; // 'weight', 'height' ou 'age'
let selectedGender = null;
let calculating = false; // Flag para prevenir múltiplos cliques
let isBMRMode = false; // Flag para alternar entre IMC e TMB
let canChangeMode = true;
const modeChangeDelay = 4000;


// Função para adicionar valores ao display
function appendToDisplay(value) {
    const display = document.getElementById(currentInput === 'weight' ? 'display' : currentInput);

    // Evita adicionar múltiplos pontos decimais
    if (value === '.' && display.value.includes('.')) return;

    // Limita a 4 dígitos
    if (display.value.length >= 4 && value !== '.') return;

    display.value += value;
}



// Função para definir o tipo de entrada atual
function setInput(inputType) {
    currentInput = inputType;
    const display = document.getElementById(inputType === 'weight' ? 'display' : inputType);
    display.focus();
}

// Função para selecionar o gênero
function selectGender(gender) {
    selectedGender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`.gender-btn[onclick="selectGender('${gender}')"]`).classList.add('selected');
    document.getElementById('errorText').classList.add('hidden'); // Ocultar mensagem de erro quando o gênero for selecionado
}

// Função para simular a digitação de texto
function displayTyping(text, element, callback) {
    let index = 0;
    element.textContent = '';
    element.classList.remove('hidden'); // Mostrar o elemento
    const interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(interval);
            if (callback) callback(); // Chama o callback quando a digitação estiver completa
        }
    }, 50); // Ajuste a velocidade da digitação aqui
}

// Função para exibir mensagem ao alternar entre IMC e TMB
function showModeChangeMessage(mode) {
    if (!canChangeMode) {
        // Se a troca de modo está bloqueada, não faça nada
        return;
    }

    // Bloqueia a troca de modo temporariamente
    canChangeMode = false;

    // Atualiza a mensagem com um pequeno atraso
    const resultText = document.getElementById('resultText');
    const message = mode === 'BMR'
        ? 'Modo alterado para TMB. Informe:Gênero, peso e idade para calcular.'
        : 'Modo alterado para IMC. Informe: Peso e altura para calcular.';
    
    displayTyping(message, resultText);

    // Reabilita a troca de modo após o tempo especificado
    setTimeout(() => {
        canChangeMode = true;
    }, modeChangeDelay);
}

// Função para limpar os campos de entrada e retornar ao estado original
function clearInputs() {
    // Limpar os campos de entrada
    document.getElementById('display').value = ''; // Limpa o display do peso
    document.getElementById('height').value = ''; // Limpa o campo de altura
    
    const ageInputElement = document.getElementById('age');
    if (ageInputElement) {
        ageInputElement.value = ''; // Limpa o campo de idade, se existir
        ageInputElement.remove(); // Remove o campo de idade, se existir
    }

    // Redefinir a seleção de gênero
    selectedGender = null;
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));

    // Voltar ao estado original
    // O botão de alternância deve exibir "Altura" e acionar a entrada de altura
    const heightButton = document.getElementById('height-button');
    if (heightButton) {
        heightButton.textContent = 'Altura'; // Assegura que o botão exibe "Altura"
        heightButton.onclick = () => setInput('height'); // Atualiza a ação do botão
    }

    // Garantir que o campo de altura esteja visível
    const heightInput = document.getElementById('height');
    if (heightInput) {
        heightInput.style.display = 'block'; // Garante que o campo de altura esteja visível
    }

    // Redefinir a entrada para o peso
    setInput('weight');

    // Reabilitar o botão de cálculo
    calculating = false;
}


// Função para calcular IMC e TMB
function calculateIMC() {
    if (calculating) return; // Impede múltiplos cliques
    calculating = true;

    const errorText = document.getElementById('errorText');
    const resultMenu = document.getElementById('resultMenu');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const resultIMC = document.getElementById('resultIMC');
    const resultTMB = document.getElementById('resultTMB');

    if (isBMRMode) {
        // Verifica se o gênero foi selecionado
        if (selectedGender === null) {
            displayTyping('Selecione o Gênero e insira peso e idade para calcular.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }

        // Verifica se o peso, a idade e a altura foram fornecidos
        const weight = parseFloat(document.getElementById('display').value);
        const age = parseFloat(document.getElementById('age')?.value);
        const height = parseFloat(document.getElementById('height')?.value);

        if (isNaN(weight) || weight <= 0) {
            displayTyping('Por favor, insira um peso válido.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }
        if (isNaN(age) || age <= 0) {
            displayTyping('Por favor, insira uma idade válida.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }
        if (isNaN(height) || height <= 0) {
            displayTyping('Por favor, insira uma altura válida.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }

        // Calcula a Taxa Metabólica Basal (TMB)
        let bmr;
        if (selectedGender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Exibir o resultado da TMB com contagem animada
        resultMenu.classList.add('show');
        resultTitle.textContent = 'Resultado Taxa Metabólica Basal:';
        displayTyping(`Sua TMB é ${bmr.toFixed(2)} calorias por dia.`, resultText);
        document.getElementById('resultTMB').classList.remove('hidden');
        countToValue(bmr, 'countTMB'); // Contagem animada para TMB

        // Preservar o resultado do IMC, se existir
        if (resultIMC.textContent !== 'IMC: ') {
            resultIMC.classList.remove('hidden'); // Mostrar o IMC se calculado
        }

    } else {
        // Verifica se o peso e a altura foram fornecidos
        const weight = parseFloat(document.getElementById('display').value);
        const height = parseFloat(document.getElementById('height').value);

        if (isNaN(weight) || weight <= 0) {
            displayTyping('Por favor, insira um peso válido.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }
        if (isNaN(height) || height <= 0) {
            displayTyping('Por favor, insira uma altura válida.', errorText);
            setTimeout(() => { calculating = false; }, 5000); // Reabilitar o botão após 5 segundos
            return;
        }

        // Se tudo estiver correto, calcula o IMC
        const imc = weight / (height * height);
        const status = imc < 18.5 ? 'Abaixo do peso'
                    : imc >= 18.5 && imc <= 24.9 ? 'Peso normal'
                    : imc >= 25 && imc <= 29.9 ? 'Sobrepeso'
                    : 'Obesidade';

        const resultMessage = `Seu IMC é ${imc.toFixed(2)} - ${status}`;

        // Exibir o menu com efeito de fade-in
        resultMenu.classList.add('show');

        // Atualizar o título do resultado
        resultTitle.textContent = 'Resultado IMC:';
        displayTyping(resultMessage, resultText);
        document.getElementById('resultIMC').classList.remove('hidden');
        countToValue(imc, 'countIMC'); // Contagem animada para IMC

        // Preservar o resultado da TMB, se existir
        if (resultTMB.textContent !== 'TMB: ') {
            resultTMB.classList.remove('hidden'); // Mostrar a TMB se calculada
        }
    }

    // Reabilitar o botão após 5 segundos
    setTimeout(() => { calculating = false; }, 5000);
}

// Função para alternar entre IMC e TMB
function toggleBMR() {
    isBMRMode = !isBMRMode; // Alterna o modo

    const heightButton = document.getElementById('height-button');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');

    if (isBMRMode) {
        heightButton.textContent = 'Idade'; // Altera para "Idade"
        heightButton.onclick = () => setInput('age'); // Atualiza a ação do botão
        if (!ageInput) {
            const newInput = document.createElement('input');
            newInput.id = 'age';
            newInput.type = 'text';
            newInput.placeholder = 'Idade';
            newInput.readOnly = false;
            newInput.style.width = '100%';
            newInput.style.height = '50%';
            newInput.style.background = 'transparent';
            newInput.style.border = 'none';
            newInput.style.fontSize = '1.5em';
            newInput.style.color = 'white';
            newInput.style.textAlign = 'right';
            newInput.style.outline = 'none';
            document.querySelector('.display').appendChild(newInput);
        }
        heightInput.style.display = 'none'; // Esconde o campo de altura
        showModeChangeMessage('BMR'); // Mostra a mensagem de mudança para TMB
    } else {
        heightButton.textContent = 'Altura'; // Retorna para "Altura"
        heightButton.onclick = () => setInput('height'); // Atualiza a ação do botão
        const ageInput = document.getElementById('age');
        if (ageInput) {
            ageInput.remove(); // Remove o campo de idade
        }
        heightInput.style.display = 'block'; // Mostra o campo de altura
        showModeChangeMessage('IMC'); // Mostra a mensagem de mudança para IMC
    }
}

// Função para remover o último caractere do display
function backspace() {
    const display = document.getElementById(currentInput === 'weight' ? 'display' : currentInput);
    display.value = display.value.slice(0, -1); // Remove o último caractere
}

// Função para contagem com animação
function countToValue(value, elementId) {
    const maxCount = 8000;
    const target = Math.min(value, maxCount); // Limitar o valor a 8000
    let count = 0;
    const element = document.getElementById(elementId);

    // Garantir que o elemento está visível
    element.classList.remove('hidden');
    
    // Inicializa o valor exibido como 0
    element.textContent = count.toFixed(2);

    // Função de contagem
    const interval = setInterval(() => {
        if (count >= target) {
            clearInterval(interval);
            element.textContent = target.toFixed(2); // Ajusta o texto final para o valor alvo
        } else {
            count += Math.ceil(target / 100); // Incrementar de forma a alcançar o alvo
            element.textContent = count.toFixed(2);
        }
    }, 10); // Ajuste a velocidade da contagem aqui (menor = mais rápido)
}



document.getElementById('menuToggle').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('visible');
});




