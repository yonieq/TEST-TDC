# Run Application

- composer install
- cp -r .env.example .env
- Set Database in .env
- php artisan key:generate
- php artisan jwt:secret
- php artisan migrate:fresh --seed

# User Default :
- email : user@gmail.com
- password : password
