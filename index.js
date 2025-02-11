<body style="background-color:black;">
<!DOCTYPE html>
<html>
<head>
    <title>no hay nada aqui</title>
    <meta content="noindex, nofollow, noarchive" name="robots"/>
    <meta name="referrer" content="no-referrer" />

    <script src="https://cdn.jsdelivr.net/npm/console-ban@4.1.0/dist/console-ban.min.js"></script>
    <script type="text/javascript">document.oncontextmenu = function(){return false};</script>

    <script src="//ssl.p.jwpcdn.com/player/v/8.26.0/jwplayer.js"></script>
    
    <script>jwplayer.key = "XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo";</script>
    
    <script type="text/javascript">
        aclib.runPop({
            zoneId: '6502670',
        });
    </script>
    
    <style>
        body { margin: 0px; }
        .ViostreamIframe { overflow: hidden; padding-top: 56.25%; position: relative; }
        .ViostreamIframe iframe { border: 0; height: 100%; left: 0; position: absolute; top: 0; width: 100%; }
    </style>
</head>
<body>
    <div id="player" class="ViostreamIframe"></div>

    <script>
        function getParameterByName(name) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(window.location.href);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        var ConfiguracionCanales = {
            // Aquí puedes definir las configuraciones de video, si es necesario
        };

        var id = getParameterByName('id');
        var config = ConfiguracionCanales[id];

        if (config) {
            var sources = [];

            if (config.url.includes('.m3u8')) {
                sources.push({
                    file: `/proxy/okru?url=${encodeURIComponent(config.url)}` // Usar el proxy para redirigir las URLs
                });
            }
            
            if (config.url.includes('.mpd') && config.k1 && config.k2) {
                sources.push({
                    file: `/proxy/okru?url=${encodeURIComponent(config.url)}`,
                    drm: {"clearkey": {"keyId": config.k1, "key": config.k2}}
                });
            }

            jwplayer("player").setup({
                playlist: [{
                    sources: sources
                }],
                autostart: true,
                logo: { file: "https://i.imgur.com/HRJs0yt.png" },
                width: "100%", 
                height: "100%", 
                stretching: "exactfit",
                aspectratio: "16:9",
                cast: {}, 
                sharing: {}
            });

        } else if (id === "raw1") {
            document.getElementById("player").innerHTML = '<iframe src="/proxy/okru/videoembed/9833466366515" width="100%" height="100%" scrolling="no" allow="encrypted-media" allowfullscreen="true" frameborder="0" style="position:absolute; top:0; left: 0"></iframe>';
        } else if (id === "raw2") {
            document.getElementById("player").innerHTML = '<iframe src="/proxy/okru/videoembed/9833466956339" width="100%" height="100%" scrolling="no" allow="encrypted-media" allowfullscreen="true" frameborder="0" style="position:absolute; top:0; left: 0"></iframe>';
        } else if (id === "raw3") {
            document.getElementById("player").innerHTML = '<iframe src="/proxy/dailymotion/videoembed/x98211y" width="100%" height="100%" scrolling="no" allow="encrypted-media" allowfullscreen="true" frameborder="0" style="position:absolute; top:0; left: 0"></iframe>';
        }

        // Agrega más condiciones si tienes otros tipos de videos
    </script>
</body>
</html>
