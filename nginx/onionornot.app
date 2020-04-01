# Certbot will rejig this into the correct SSL config
server {
	listen 80;
	listen [::]:80;

	server_name onionornot.app www.onionornot.app;

	root /data/www/onionornot.app;
	index index.html;

	location / {
		try_files $uri $uri/ =404;
	}

	location ~ ^/reddit/(\w+)$ {
		resolver 8.8.8.8;
		proxy_pass https://www.reddit.com/r/$1/hot/.json$is_args$args;
	}

	error_page 500 502 503 504 /500.html;
	client_max_body_size 4G;
	keepalive_timeout 10;
}
