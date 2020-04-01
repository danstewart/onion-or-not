# onion-or-not

## Project setup
```
# Install dpes
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

### Development mode
```
npm run serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
