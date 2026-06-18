const CACHE_NAME =
    "drivebox-v1";

const arquivos = [

    "/DriveBox/",

    "/DriveBox/index.php",

    "/DriveBox/css/style.css",

    "/DriveBox/js/app.js",

    "/DriveBox/js/gps.js",

    "/DriveBox/js/db.js",

    "/DriveBox/js/sync.js",

    "/DriveBox/icons/icon-192.png",

    "/DriveBox/icons/icon-512.png"

];

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(cache => {

                return cache.addAll(
                    arquivos
                );

            })

        );

    }

);

self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(response => {

                return (

                    response ||

                    fetch(
                        event.request
                    )

                );

            })

        );

    }

);