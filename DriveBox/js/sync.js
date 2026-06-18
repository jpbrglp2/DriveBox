function atualizarStatusInternet() {

    const status =
        document.getElementById(
            "statusInternet"
        );

    if (!status) {
        return;
    }

    if (navigator.onLine) {

        status.textContent =
            "🟢 Online";

    } else {

        status.textContent =
            "🔴 Offline";
    }
}

window.addEventListener(
    "online",
    atualizarStatusInternet
);

window.addEventListener(
    "offline",
    atualizarStatusInternet
);

function atualizarUltimaSync() {

    const elemento =
        document.getElementById(
            "ultimaSync"
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        new Date()
            .toLocaleTimeString();
}

async function sincronizarViagens() {

    atualizarStatusInternet();

    if (!navigator.onLine) {

        console.log(
            "Sem internet. Sincronização cancelada."
        );

        return;
    }

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

    request.onsuccess =
        async function () {

            const viagens =
                request.result;

            let houveSincronizacao =
                false;

            for (
                const viagem
                of viagens
            ) {

                if (
                    viagem.sincronizada
                ) {
                    continue;
                }

                console.log(
                    "VIAGEM ENVIADA:",
                    viagem
                );

                try {

                    const resposta =
                        await fetch(
                            "api/sync.php",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        viagem
                                    )
                            }
                        );

                    const texto =
                        await resposta.text();

                    console.log(
                        "RESPOSTA PHP:",
                        texto
                    );

                    let resultado;

                    try {

                        resultado =
                            JSON.parse(
                                texto
                            );

                    } catch {

                        console.error(
                            "Resposta inválida do PHP"
                        );

                        continue;
                    }

                    if (
                        resultado.success
                    ) {

                        viagem.sincronizada =
                            true;

                        const tx =
                            db.transaction(
                                ["viagens"],
                                "readwrite"
                            );

                        const viagemStore =
                            tx.objectStore(
                                "viagens"
                            );

                        viagemStore.put(
                            viagem
                        );

                        houveSincronizacao =
                            true;

                        console.log(
                            `Viagem ${viagem.id} sincronizada`
                        );

                    } else {

                        console.error(
                            "Erro na sincronização:",
                            resultado.message
                        );
                    }

                } catch (error) {

                    console.error(
                        "Erro ao conectar com o servidor:",
                        error
                    );
                }
            }

            atualizarPendentes();

            if (
                houveSincronizacao
            ) {

                atualizarUltimaSync();
            }
        };

    request.onerror =
        function () {

            console.error(
                "Erro ao ler IndexedDB"
            );
        };
}

window.addEventListener(
    "load",
    async () => {

        atualizarStatusInternet();

        atualizarPendentes();

        await sincronizarViagens();
    }
);