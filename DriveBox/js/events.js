function registrarEvento(
    tipo,
    velocidadeAntes,
    velocidadeDepois
){

    const transaction =
        db.transaction(
            ["eventos"],
            "readwrite"
        );

    const store =
        transaction.objectStore(
            "eventos"
        );

    store.add({

        viagemId:
            viagemAtual?.id || null,

        tipo,

        velocidadeAntes,

        velocidadeDepois,

        horario:
            Date.now()

    });

    console.log(
        "Evento registrado:",
        tipo
    );
}

function carregarEventos(){

    const transaction =
        db.transaction(
            ["eventos"],
            "readonly"
        );

    const store =
        transaction.objectStore(
            "eventos"
        );

    const request =
        store.getAll();

    request.onsuccess =
    function(){

        const div =
            document.getElementById(
                "eventos"
            );

        div.innerHTML = "";

        request.result.forEach(
            evento => {

                div.innerHTML += `

                <div class="card">

                    <strong>
                        ${evento.tipo}
                    </strong>

                    <br>

                    ${new Date(
                        evento.horario
                    ).toLocaleString()}

                </div>

                `;
            }
        );
    };
}