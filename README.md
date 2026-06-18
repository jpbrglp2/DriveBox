# 🚗 DriveBox

**DriveBox** é uma aplicação web/PWA que funciona como uma *caixa preta para carros*, registrando velocidade, distância e eventos de direção em tempo real usando GPS.

---

## 📌 Sobre o projeto

O DriveBox foi desenvolvido com foco em:

- Monitoramento de viagens em tempo real
- Registro de velocidade e rota via GPS
- Histórico de trajetos
- Análise de direção (velocidade média e máxima)
- Funcionamento como PWA (instalável no celular)

---

## ⚙️ Tecnologias utilizadas

- PHP (backend)
- MySQL (banco de dados)
- JavaScript (GPS e lógica em tempo real)
- HTML5 + CSS3
- PWA (Service Worker + Manifest)
- API Geolocation do navegador

---

## 🧠 Como funciona

1. O usuário inicia uma viagem
2. O sistema captura localização via GPS
3. Os dados são enviados ao backend PHP
4. O banco registra:
   - Latitude e longitude
   - Velocidade atual
   - Tempo de viagem
   - Distância percorrida
5. Ao finalizar, o sistema gera um resumo da viagem

---

## 🗄️ Estrutura do projeto

```bash
/drivebox
│
├── /api
│   ├── iniciar_viagem.php
│   ├── salvar_ponto.php
│   └── finalizar_viagem.php
│
├── /config
│   └── db.php
│
├── /assets
│   ├── css/
│   └── js/
│
├── /pwa
│   ├── manifest.json
│   └── service-worker.js
│
├── index.php
└── README.md
```

## 🗄️ Banco de dados

### Tabela: viagens

```sql
CREATE TABLE viagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inicio DATETIME,
    fim DATETIME,
    distancia FLOAT DEFAULT 0,
    velocidade_media FLOAT DEFAULT 0,
    velocidade_maxima FLOAT DEFAULT 0
);
```
### Tabela: pontos_gps

```sql
CREATE TABLE pontos_gps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT,
    latitude DOUBLE,
    longitude DOUBLE,
    velocidade FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📱 Funcionalidade PWA

O DriveBox pode ser instalado no celular como aplicativo:

- Funciona offline (parcialmente)
- Ícone na tela inicial
- Execução rápida como app nativo

## 🧑‍💻 Autor

Desenvolvido por **jp**

Projeto focado em aprendizado prático de:

- Backend com PHP
- Geolocalização
- Sistemas de monitoramento
- PWA e experiência mobile
