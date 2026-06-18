<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#38bdf8">
    <title>DriveBox</title>

    <link rel="stylesheet" href="css/style.css">
    <link rel="manifest" href="pwa/manifest.json">
</head>

<body>

    <h1>DriveBox 🚗</h1>

    <div class="card">

        <h2>Status</h2>

        <p>
            Conexão:
            <span id="statusInternet">
                Verificando...
            </span>
        </p>

        <p>
            Viagens Pendentes:
            <span id="viagensPendentes">
                0
            </span>
        </p>

        <p>
            Última Sincronização:
            <span id="ultimaSync">
                Nunca
            </span>
        </p>

    </div>

    <div class="card">
        <h2>Velocidade Atual</h2>
        <p id="velocidade">0 km/h</p>
    </div>

    <button id="btnIniciar">
        Iniciar Viagem
    </button>

    <button id="btnParar">
        Encerrar Viagem
    </button>

    <hr>

    <h2>Histórico</h2>

    <div id="historico"></div>

    <div id="detalhes"></div>

    <div id="mapa"></div>

    <div id="eventos"></div>

    <script src="js/db.js"></script>
    <script src="js/gps.js"></script>
    <script src="events.js"></script>
    <script src="sync.js"></script>
    <script src="app.js"></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

    <script src="https://unpkg.com/leaflet/dist/leaflet.js">
    </script>
</body>

</html>