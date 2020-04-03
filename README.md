# onion-or-not

## Project setup
```
# Bootstrap
[[ -f /bootstrapped ]] || bash <(curl -s https://raw.githubusercontent.com/danstewart/server-bootstrap/master/bootstrap.sh)

# Install deps
dnf install npm
npm install

# Build
npm run build

# Link
ln -s $(pwd)/dist/ /data/www/onionornot.app

# nginx
cp nginx/onionornot.app /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/onionornot.app /etc/nginx/sites-enabled/
systemctl restart nginx

# Certbot
sudo certbot --nginx
```

### Deploy
```
# Updates the dist/ dir which is already symlinked to the web root
npm run build
```

### Development mode
```
npm run serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
