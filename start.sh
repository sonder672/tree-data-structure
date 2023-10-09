#Bash to Dockerfile
node bin/seeders.js &

pm2-runtime start ecosystem.config.js