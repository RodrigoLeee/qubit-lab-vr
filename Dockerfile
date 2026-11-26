# Imagem oficial do Caddy como base
FROM caddy:2-alpine

# Configuração do servidor
COPY Caddyfile /etc/caddy/Caddyfile

# Conteúdo do jogo Qubit Lab VR (fica "congelado" dentro da imagem)
COPY jogo/ /srv/

EXPOSE 8080 8443
