# Gunakan base image PHP dengan ekstensi yang dibutuhkan Laravel
FROM php:8.3-fpm


# Install dependensi sistem dan ekstensi PHP yang diperlukan
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Bersihkan cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install ekstensi PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy seluruh kode backend
COPY . .

# Install dependensi Laravel
RUN composer install

# Expose port default Laravel
EXPOSE 8000

# Jalankan server Laravel
CMD php artisan serve --host=0.0.0.0 --port=8000