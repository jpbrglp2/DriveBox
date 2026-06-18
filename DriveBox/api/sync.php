<?php

ini_set(
    'display_errors',
    1
);

error_reporting(
    E_ALL
);

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $dados =
        json_decode(
            file_get_contents("php://input"),
            true
        );

    if(!$dados){

        throw new Exception(
            "JSON inválido"
        );
    }

    $stmt = $pdo->prepare("
        INSERT INTO viagens
        (
            inicio,
            fim,
            duracao,
            distancia,
            velocidade_media
        )
        VALUES
        (
            :inicio,
            :fim,
            :duracao,
            :distancia,
            :velocidade_media
        )
    ");

    $stmt->execute([

        ":inicio" =>
            $dados["inicio"],

        ":fim" =>
            $dados["fim"],

        ":duracao" =>
            $dados["duracao"],

        ":distancia" =>
            $dados["distancia"],

        ":velocidade_media" =>
            $dados["velocidadeMedia"]

    ]);

    $viagemId =
        $pdo->lastInsertId();

    $stmtPonto =
        $pdo->prepare("
            INSERT INTO pontos_gps
            (
                viagem_id,
                latitude,
                longitude,
                velocidade,

                horario
            )
            VALUES
            (
                :viagem_id,
                :latitude,
                :longitude,
                :velocidade,
               
                :horario
            )
        ");

    foreach(
        $dados["pontos"]
        as $ponto
    ){

        $stmtPonto->execute([

            ":viagem_id" =>
                $viagemId,

            ":latitude" =>
                $ponto["lat"],

            ":longitude" =>
                $ponto["lng"],

            ":velocidade" =>
                $ponto["velocidade"],

            ":horario" =>
                $ponto["horario"]

        ]);
    }

    echo json_encode([

        "success" => true,

        "viagem_id" =>
            $viagemId

    ]);

} catch(Throwable $e){

    http_response_code(500);

echo json_encode([

    "success" => false,

    "message" =>
        $e->getMessage(),

    "file" =>
        $e->getFile(),

    "line" =>
        $e->getLine()

]);
}