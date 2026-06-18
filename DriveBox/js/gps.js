let watchId = null;

let viagemAtual = null;

let velocidadeAnterior = 0;

let ultimoPonto = null;

function iniciarGPS() {

    viagemAtual = {

        inicio: Date.now(),

        fim: null,

        duracao: 0,

        distancia: 0,

        velocidadeMedia: 0,

        velocidadeMaxima: 0,

        sincronizada: false,

        pontos: []

    };

    velocidadeAnterior = 0;

    ultimoPonto = null;

    watchId = navigator.geolocation.watchPosition(

        function(position) {

            let velocidade = 0;

            if (
                position.coords.speed !== null
            ) {

                velocidade =
                    position.coords.speed * 3.6;

            } else if (ultimoPonto) {

                const distancia = calcularDistancia(

                    ultimoPonto.lat,
                    ultimoPonto.lng,

                    position.coords.latitude,
                    position.coords.longitude

                );

                const tempo =

                    (
                        Date.now() -
                        ultimoPonto.horario
                    ) / 1000;

                if (tempo > 0) {

                    velocidade =
                        (distancia / tempo)
                        * 3.6;
                }
            }

            if (velocidade < 3) {

                velocidade = 0;
            }

            if (velocidade > 250) {

                velocidade = 0;
            }

            document.getElementById(
                "velocidade"
            ).innerText =
                velocidade.toFixed(1)
                + " km/h";

            if (
                velocidade >
                viagemAtual.velocidadeMaxima
            ) {

                viagemAtual.velocidadeMaxima =
                    velocidade;
            }

            viagemAtual.pontos.push({

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude,

                velocidade:
                    velocidade,

                horario:
                    Date.now()

            });

            ultimoPonto = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude,

                horario:
                    Date.now()

            };

            const distanciaAtual =
                calcularDistanciaTotal(
                    viagemAtual.pontos
                );

            const duracaoAtual =
                Math.floor(
                    (
                        Date.now() -
                        viagemAtual.inicio
                    ) / 1000
                );

            const velocidadeMediaAtual =
                calcularVelocidadeMedia(
                    distanciaAtual,
                    duracaoAtual
                );

            document.getElementById(
                "velocidadeMedia"
            ).innerText =
                velocidadeMediaAtual.toFixed(1)
                + " km/h";

            salvarViagemAtiva(
                viagemAtual
            );

            if (
                velocidadeAnterior -
                velocidade > 20
            ) {

                registrarEvento(

                    "freada_brusca",

                    velocidadeAnterior,

                    velocidade

                );
            }

            if (
                velocidade -
                velocidadeAnterior > 20
            ) {

                registrarEvento(

                    "aceleracao_brusca",

                    velocidadeAnterior,

                    velocidade

                );
            }

            velocidadeAnterior =
                velocidade;

        },

        function(error) {

            console.log(
                "Erro GPS:",
                error
            );

        },

        {

            enableHighAccuracy: true,

            maximumAge: 0,

            timeout: 10000

        }

    );
}

function pararGPS() {

    navigator.geolocation.clearWatch(
        watchId
    );

    viagemAtual.fim =
        Date.now();

    viagemAtual.duracao =
        Math.floor(
            (
                viagemAtual.fim -
                viagemAtual.inicio
            ) / 1000
        );

    viagemAtual.distancia =
        calcularDistanciaTotal(
            viagemAtual.pontos
        );

    viagemAtual.velocidadeMedia =
        calcularVelocidadeMedia(
            viagemAtual.distancia,
            viagemAtual.duracao
        );

    salvarViagem(
        viagemAtual
    );

    apagarViagemAtiva();

    ultimoPonto = null;

    viagemAtual = null;
}

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371000;

    const dLat =
        (lat2 - lat1)
        * Math.PI / 180;

    const dLon =
        (lon2 - lon1)
        * Math.PI / 180;

    const a =

        Math.sin(dLat / 2)
        *
        Math.sin(dLat / 2)

        +

        Math.cos(
            lat1 * Math.PI / 180
        )

        *

        Math.cos(
            lat2 * Math.PI / 180
        )

        *

        Math.sin(dLon / 2)

        *

        Math.sin(dLon / 2);

    const c =

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );

    return R * c;
}

function calcularDistanciaTotal(
    pontos
) {

    let total = 0;

    for (
        let i = 1;
        i < pontos.length;
        i++
    ) {

        total +=
            calcularDistancia(

                pontos[
                    i - 1
                ].lat,

                pontos[
                    i - 1
                ].lng,

                pontos[i].lat,

                pontos[i].lng

            );
    }

    return total;
}

function calcularVelocidadeMedia(
    distancia,
    duracao
) {

    if (
        duracao === 0
    ) {

        return 0;
    }

    return (
        distancia /
        duracao
    ) * 3.6;
}