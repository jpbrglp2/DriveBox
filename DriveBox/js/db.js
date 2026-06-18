let db;

const request = indexedDB.open(
    "DriveBoxDB",
    3
);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    if (
        !db.objectStoreNames.contains(
            "viagens"
        )
    ) {

        db.createObjectStore(
            "viagens",
            {
                keyPath: "id",
                autoIncrement: true
            }
        );
    }

    if (
        !db.objectStoreNames.contains(
            "viagem_ativa"
        )
    ) {

        db.createObjectStore(
            "viagem_ativa",
            {
                keyPath: "id"
            }
        );
    }

    if(
    !db.objectStoreNames.contains(
        "eventos"
    )
){

    db.createObjectStore(
        "eventos",
        {
            keyPath: "id",
            autoIncrement: true
        }
    );
}
};

request.onsuccess = function (event) {

    db = event.target.result;

    carregarHistorico();
};

function salvarViagemAtiva(viagem) {

    const transaction =
        db.transaction(
            ["viagem_ativa"],
            "readwrite"
        );

    const store =
        transaction.objectStore(
            "viagem_ativa"
        );

    store.put({
        id: 1,
        dados: viagem
    });
}

function carregarViagemAtiva() {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    ["viagem_ativa"],
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    "viagem_ativa"
                );

            const request =
                store.get(1);

            request.onsuccess =
                () => resolve(
                    request.result
                );

            request.onerror =
                reject;
        }
    );
}

function apagarViagemAtiva() {

    const transaction =
        db.transaction(
            ["viagem_ativa"],
            "readwrite"
        );

    const store =
        transaction.objectStore(
            "viagem_ativa"
        );

    store.delete(1);
}

function salvarViagem(viagem) {

    const transaction =
        db.transaction(
            ["viagens"],
            "readwrite"
        );

    const store =
        transaction.objectStore(
            "viagens"
        );

    store.add(viagem);

    carregarHistorico();

    atualizarPendentes();
}



function carregarHistorico() {

    const transaction =
        db.transaction(
            ["viagens"],
            "readonly"
        );

    const store =
        transaction.objectStore(
            "viagens"
        );

    const request =
        store.getAll();

    request.onsuccess = function () {

        const historico =
            document.getElementById(
                "historico"
            );

        historico.innerHTML = "";

        request.result.forEach(v => {

            historico.innerHTML += `

                <div class="card">

                    <p>
                        <strong>Início:</strong>
                        ${new Date(v.inicio)
                    .toLocaleString()}
                    </p>

                    <p>
                        <strong>Fim:</strong>
                        ${v.fim
                    ? new Date(v.fim)
                        .toLocaleString()
                    : "-"
                }
                    </p>

                    <p>
                        <strong>Duração:</strong>
                        ${v.duracao
                    ? formatarDuracao(
                        v.duracao
                    )
                    : "-"
                }
                    </p>

                    <p>
                        <strong>Distância:</strong>
                        ${v.distancia
                    ? (
                        v.distancia / 1000
                    ).toFixed(2)
                    : "0.00"
                } km
                    </p>

                    <p>
                        <strong>Velocidade Média:</strong>
                        ${v.velocidadeMedia
                    ? v.velocidadeMedia
                        .toFixed(2)
                    : "0.00"
                } km/h
                    </p>

                    <p>
                        <strong>Pontos:</strong>
                        ${v.pontos
                    ? v.pontos.length
                    : 0}
                    </p>

                    <button
                        onclick="
                            abrirDetalhes(
                                ${v.id}
                            )
                        "
                    >
                        Ver Detalhes
                    </button>

                </div>

            `;
        });
    };
}



function abrirDetalhes(id) {

    const transaction =
        db.transaction(
            ["viagens"],
            "readonly"
        );

    const store =
        transaction.objectStore(
            "viagens"
        );

    const request =
        store.get(id);

    request.onsuccess = function () {

        mostrarDetalhes(
            request.result
        );
    };
}

function formatarDuracao(
    segundos
) {

    const horas =
        Math.floor(
            segundos / 3600
        );

    const minutos =
        Math.floor(
            (segundos % 3600)
            / 60
        );

    const seg =
        segundos % 60;

    return `${horas}h ${minutos}min ${seg}s`;
}

function atualizarPendentes() {

    const transaction =
        db.transaction(
            ["viagens"],
            "readonly"
        );

    const store =
        transaction.objectStore(
            "viagens"
        );

    const request =
        store.getAll();

    request.onsuccess = function () {

        const pendentes =
            request.result.filter(
                viagem =>
                    !viagem.sincronizada
            ).length;

        document.getElementById(
            "viagensPendentes"
        ).textContent =
            pendentes;
    };
}