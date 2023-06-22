var jogadores = [];
        var numerosSorteados = [];
        var bingoGerado = false;
        var intervalId; 
    
        function gerarNumerosAleatorios(quantidade, min, max, numerosExistentes = []) {
            if (quantidade > (max - min + 1)) {
                console.log("Intervalo insuficiente ...");
                return [];
            }
    
            var numeros = [];
            while (numeros.length < quantidade) {
                var aleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!numeros.includes(aleatorio) && !numerosExistentes.includes(aleatorio)) {
                    numeros.push(aleatorio);
                }
            }
    
            return numeros;
        }
    
        function gerarCartela() {
            var nomeJogador = prompt('Digite o nome do jogador');
            if (!nomeJogador) {
                return;
            }
    
            var numerosExistentes = [];
    
            var cartela = [            gerarNumerosAleatorios(5, 1, 15, numerosExistentes),            gerarNumerosAleatorios(5, 16, 30, numerosExistentes),            gerarNumerosAleatorios(5, 31, 45, numerosExistentes),            gerarNumerosAleatorios(5, 46, 60, numerosExistentes),            gerarNumerosAleatorios(5, 61, 75, numerosExistentes)        ];
    
            jogadores.push({
                nomeJogador: nomeJogador,
                cartela: cartela
            });
    
            desenharCartela(nomeJogador, cartela);
            document.getElementById('reiniciarBtn').disabled = false;
            document.getElementById('jogarBtn').disabled = false;
            bingoGerado = true;

            document.getElementById('automatioBtn').disabled = false;
            document.getElementById('pararBtn').disabled = false;
        }
    
        function reiniciarJogo() {
            jogadores = [];
            numerosSorteados = [];
            document.getElementById('espaco_cartelas').innerHTML = '';
            document.getElementById('numeros_sorteados').innerHTML = '';
            document.getElementById('reiniciarBtn').disabled = true;
            document.getElementById('jogarBtn').disabled = true;
            bingoGerado = false;

            document.getElementById('automatioBtn').disabled = true;
            document.getElementById('pararBtn').disabled = true;
        }
    
        function desenharCartela(nome, cartela) {
            var div = document.getElementById('espaco_cartelas');
            var tabela = document.createElement('table');
    
            var letras = ['B', 'I', 'N', 'G', 'O'];
    
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            for (var i = 0; i < 5; i++) {
                var th = document.createElement('th');
                th.innerText = letras[i];
                tr.appendChild(th);
            }
            thead.appendChild(tr);
            tabela.appendChild(thead);
    
            var tbody = document.createElement('tbody');
            for (var i = 0; i < 5; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j < 5; j++) {
                    var td = document.createElement('td');
                    if (i === 2 && j === 2) {
                        td.innerText = "X";
                    } else {
                        td.innerText = cartela[j][i];
                    }
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            tabela.appendChild(tbody);
    
            var p = document.createElement('p');
            p.innerText = nome;
    
            div.appendChild(p);
            div.appendChild(tabela);
        }
    
        function jogar() {
            if (!bingoGerado) {
                return;
            }
    
            var numeroSorteado = gerarNumerosAleatorios(1, 1, 75, numerosSorteados)[0];
            numerosSorteados.push(numeroSorteado);
    
            var divNumerosSorteados = document.getElementById('numeros_sorteados');
            var span = document.createElement('span');
            span.className = 'bola';
            span.innerText = numeroSorteado;
            divNumerosSorteados.appendChild(span);
    
            for (var i = 0; i < jogadores.length; i++) {
                var jogador = jogadores[i];
                var cartela = jogador.cartela;
                var nomeJogador = jogador.nomeJogador;
    
                if (verificarCartela(cartela, numeroSorteado)) {
                    alert("Bingo! O jogador " + nomeJogador + " venceu!");
                    document.getElementById('jogarBtn').disabled = true;
                    bingoGerado = false;
                    return;
                }
            }
        }
    
        function verificarCartela(cartela, numeroSorteado) {
    for (var i = 0; i < cartela.length; i++) {
        var coluna = cartela[i];
        if (coluna.includes(numeroSorteado)) {
            coluna[coluna.indexOf(numeroSorteado)] = 'X';
        }
        var tdElements = document.querySelectorAll('td');
        tdElements.forEach(function(td) {
            if (td.innerText === numeroSorteado.toString()) {
                td.classList.add('bingo');
            }
        });
    }

    var todosMarcados = cartela.every(function(coluna) {
        return coluna.every(function(numero) {
            return numero === 'X';
        });
    });

    if (todosMarcados) {
        return true;
    }

    for (var i = 0; i < cartela.length; i++) {
        var coluna = cartela[i];
        if (coluna.includes(numeroSorteado)) {
            coluna[coluna.indexOf(numeroSorteado)] = 'X';
            if (verificarLinhasCartela(cartela) || verificarColunasCartela(cartela) || verificarDiagonaisCartela(cartela)) {
                return true;
            }
        }
    }

    return false;
}

function verificarVencedor() {
    var vencedores = [];
    for (var i = 0; i < jogadores.length; i++) {
        var jogador = jogadores[i];
        var cartela = jogador.cartela;
        var nomeJogador = jogador.nomeJogador;

        if (verificarCartela(cartela, numerosSorteados[numerosSorteados.length - 1])) {
            vencedores.push(nomeJogador);
        }
    }

    if (vencedores.length === 0) {
        return null;
    } else if (vencedores.length === 1) {
        return vencedores[0];
    } else {
        return 'Empate entre: ' + vencedores.join(', ');
    }
}

function jogar() {
    if (!bingoGerado) {
        return;
    }

    var numeroSorteado = gerarNumerosAleatorios(1, 1, 75, numerosSorteados)[0];
    numerosSorteados.push(numeroSorteado);

    var divNumerosSorteados = document.getElementById('numeros_sorteados');
    var span = document.createElement('span');
    span.className = 'bola';
    span.innerText = numeroSorteado;
    divNumerosSorteados.appendChild(span);

    var vencedor = verificarVencedor();
    if (vencedor !== null) {
        alert('Vencedor: ' + vencedor);
        document.getElementById('jogarBtn').disabled = true;
        bingoGerado = false;
    }
}
    
        function verificarLinhasCartela(cartela) {
            for (var i = 0; i < cartela.length; i++) {
                if (cartela[i].every((element) => element === 'X')) {
                    return true;
                }
            }
            return false;
        }
    
        function verificarColunasCartela(cartela) {
            for (var i = 0; i < cartela.length; i++) {
                var coluna = [];
                for (var j = 0; j < cartela.length; j++) {
                    coluna.push(cartela[j][i]);
                }
                if (coluna.every((element) => element === 'X')) {
                    return true;
                }
            }
            return false;
        }
    
        function verificarDiagonaisCartela(cartela) {
            var diagonal1 = [];
            var diagonal2 = [];
            for (var i = 0; i < cartela.length; i++) {
                diagonal1.push(cartela[i][i]);
                diagonal2.push(cartela[i][cartela.length - i - 1]);
            }
            if (diagonal1.every((element) => element === 'X') || diagonal2.every((element) => element === 'X')) {
                return true;
            }
            return false;
        }
    
        function gerarNumerosAutomaticamente() {
            intervalId = setInterval(jogar, 500);
        }
    
        function pararGeracaoAutomatica() {
    clearInterval(intervalId);
    document.getElementById('jogarBtn').disabled = false;
        }