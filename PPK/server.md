13.233.46.34

http://13.233.46.34/admin/login

caa@mailinator.com / Octal@123

Host : 13.233.46.34
User : ubuntu

sudo chmod -R 777 /var/www/html/api/node_modules

sudo su
cd /var/www/html/api
pm2 kill
npm install
NODE_ENV=stage pm2 start bin/www
