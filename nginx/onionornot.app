server {
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot

    server_name onionornot.app www.onionornot.app;

    root /var/www/onionornot.app;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ ^/reddit/(\w+)$ {
        resolver 8.8.8.8;
        proxy_pass https://www.reddit.com/r/$1/hot/.json$is_args$args;
    }

    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

    ssl_certificate /etc/letsencrypt/live/onionornot.app/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/onionornot.app/privkey.pem; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    listen 80;
    listen [::]:80;

    server_name onionornot.app www.onionornot.app;

    if ($host = www.onionornot.app) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = onionornot.app) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    return 404; # managed by Certbot
}
