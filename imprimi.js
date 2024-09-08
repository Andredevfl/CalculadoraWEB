document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('print-meal').addEventListener('click', () => {
        generatePDF();
    });
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Obtém os dados das refeições e total de calorias
    const mealsContainer = document.getElementById('mealsContainer').innerHTML;
    const totalCalories = document.getElementById('totalCalories').textContent;

    // Cria um container temporário para o conteúdo do PDF
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.fontFamily = 'Space Grotesk, Arial, sans-serif';
    tempDiv.style.background = '#333';
    tempDiv.style.color = '#fff';
    tempDiv.style.padding = '20px';
    tempDiv.style.borderRadius = '8px';
    tempDiv.style.width = '190mm'; // Largura A4 em mm
    tempDiv.style.boxSizing = 'border-box';
    tempDiv.style.overflow = 'hidden'; // Garante que o conteúdo não saia da área visível
    tempDiv.innerHTML = `
        <h2>Refeições</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${mealsContainer}
        </div>
        <div class="total-calories" style="margin-top: 20px; font-size: 1.2em; text-align: center;">
            Total de Calorias do Dia: <span style="font-weight: bold;">${totalCalories}</span> kcal
        </div>
    `;
    document.body.appendChild(tempDiv);

    // Converte o conteúdo para uma imagem usando html2canvas
    html2canvas(tempDiv, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Largura da página A4 em mm
        const imgHeight = canvas.height * imgWidth / canvas.width; // Mantém a proporção da imagem
        let position = 0;

        // Adiciona a imagem ao PDF
        doc.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);

        // Adiciona uma nova página se o conteúdo for muito longo
        let heightLeft = imgHeight - (doc.internal.pageSize.height - 20);
        while (heightLeft > 0) {
            doc.addPage();
            position = heightLeft > 0 ? -heightLeft : 0;
            doc.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
            heightLeft -= doc.internal.pageSize.height;
        }

        // Salva o PDF
        doc.save('relatorio_refeicao.pdf');

        // Remove o container temporário
        document.body.removeChild(tempDiv);
    });
}   

//parte de cima do menu 


document.addEventListener('DOMContentLoaded', () => {
    const toggleInfoButton = document.getElementById('toggleInfoButton');
    const additionalInfo = document.getElementById('additionalInfo');
    
    const toggleSourcesButton = document.getElementById('toggleSourcesButton');
    const sourcesInfo = document.getElementById('sourcesInfo');

    // Toggle para explicao
    toggleInfoButton.addEventListener('click', () => {
        if (additionalInfo.style.display === 'none' || additionalInfo.style.display === '') {
            additionalInfo.style.display = 'block';
            toggleInfoButton.textContent = 'Ocultar explicação';
        } else {
            additionalInfo.style.display = 'none';
            toggleInfoButton.textContent = 'Como utilizar a calculadora';
        }
    });

    
    toggleSourcesButton.addEventListener('click', () => {
        if (sourcesInfo.style.display === 'none' || sourcesInfo.style.display === '') {
            sourcesInfo.style.display = 'block';
            toggleSourcesButton.textContent = 'Ocultar fontes';
        } else {
            sourcesInfo.style.display = 'none';
            toggleSourcesButton.textContent = 'Fontes dos Valores Nutricionais';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleInfoButton = document.getElementById('toggleInfoButton');
    const toggleSourcesButton = document.getElementById('toggleSourcesButton');
    const additionalInfo = document.getElementById('additionalInfo');
    const sourcesInfo = document.getElementById('sourcesInfo');
    
    toggleInfoButton.addEventListener('click', function() {
        if (additionalInfo.classList.contains('show-info')) {
            additionalInfo.classList.remove('show-info');
        } else {
            additionalInfo.classList.add('show-info');
            //Remove qualquer classe typing anterior e reaplica para reiniciar a animacao
            additionalInfo.querySelector('p').classList.remove('custom-typing-text');
            void additionalInfo.querySelector('p').offsetWidth; // Trigger reflow 
            additionalInfo.querySelector('p').classList.add('custom-typing-text');
        }
    });

    toggleSourcesButton.addEventListener('click', function() {
        if (sourcesInfo.classList.contains('show-info')) {
            sourcesInfo.classList.remove('show-info');
        } else {
            sourcesInfo.classList.add('show-info');
            //Remove qualquer classe typing anterior e reaplica para reiniciar a animacao
            sourcesInfo.querySelector('p').classList.remove('custom-typing-text');
            void sourcesInfo.querySelector('p').offsetWidth; // Trigger reflow 
            sourcesInfo.querySelector('p').classList.add('custom-typing-text');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleInfoButton = document.getElementById('toggleInfoButton');
    const toggleSourcesButton = document.getElementById('toggleSourcesButton');
    const additionalInfo = document.getElementById('additionalInfo');
    const sourcesInfo = document.getElementById('sourcesInfo');
    
    toggleInfoButton.addEventListener('click', function() {
        if (additionalInfo.classList.contains('show-info')) {
            additionalInfo.classList.remove('show-info');
        } else {
            additionalInfo.classList.add('show-info');
            // Remova a classe e reapply para reiniciar a animação
            additionalInfo.querySelectorAll('p').forEach(p => {
                p.classList.remove('reveal-text');
                void p.offsetWidth; // Trigger reflow
                p.classList.add('reveal-text');
            });
        }
    });

    toggleSourcesButton.addEventListener('click', function() {
        if (sourcesInfo.classList.contains('show-info')) {
            sourcesInfo.classList.remove('show-info');
        } else {
            sourcesInfo.classList.add('show-info');
            // Remova a classe e reapply para reiniciar a animação
            sourcesInfo.querySelectorAll('p').forEach(p => {
                p.classList.remove('reveal-text');
                void p.offsetWidth; // Trigger reflow
                p.classList.add('reveal-text');
            });
        }
    });
});



// Seleciona o botão e a seção de fatos
const showFactsBtn = document.getElementById('showFactsBtn');
const factsSection = document.getElementById('factsSection');

// Adiciona um evento de clique ao botão
showFactsBtn.addEventListener('click', () => {
    if (factsSection.style.display === 'none' || factsSection.style.display === '') {
        factsSection.style.display = 'block'; // Exibe a seção de fatos
        factsSection.classList.add('fade-in'); // Adiciona classe para animação de fade-in
        showFactsBtn.textContent = 'Ocultar Fatos';
    } else {
        factsSection.style.display = 'none'; // Oculta a seção de fatos
        showFactsBtn.textContent = 'Mostrar Fatos';
    }
});


document.getElementById('menuToggle').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('visible');
});






