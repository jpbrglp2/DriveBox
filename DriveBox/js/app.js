document
.getElementById(
    "btnIniciar"
)
.addEventListener(
    "click",
    iniciarGPS
);

document
.getElementById(
    "btnParar"
)
.addEventListener(
    "click",
    pararGPS
);

window.addEventListener(
    "load",
    async () => {

        atualizarStatusInternet();

        atualizarPendentes();

        await sincronizarViagens();

        try {

            const viagemSalva =
                await carregarViagemAtiva();

            if (
                viagemSalva &&
                viagemSalva.dados
            ) {

                viagemAtual =
                    viagemSalva.dados;

                console.log(
                    "Viagem recuperada com sucesso"
                );

                document
                .getElementById(
                    "velocidade"
                )
                .innerText =
                    "Viagem recuperada";

            }

        } catch(error) {

            console.error(
                "Erro ao recuperar viagem:",
                error
            );

        }

    }
);

window.addEventListener(
    "online",
    async () => {

        atualizarStatusInternet();

        await sincronizarViagens();

    }
);

window.addEventListener(
    "offline",
    () => {

        atualizarStatusInternet();

    }
);

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator
                .serviceWorker
                .register(
                    "pwa/service-worker.js"
                )
                .then(() => {

                    console.log(
                        "PWA ativo"
                    );

                })
                .catch(error => {

                    console.error(
                        "Erro no Service Worker:",
                        error
                    );

                });

        }
    );

}

if (
    "serviceWorker"
    in navigator
) {

    navigator
        .serviceWorker

        .register(
            "pwa/service-worker.js"
        )

        .then(() => {

            console.log(
                "PWA ativo"
            );

        })

        .catch(error => {

            console.log(
                error
            );

        });

}