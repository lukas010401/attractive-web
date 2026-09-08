# Déploiement Hostinger - Attractive

## DNS

Créer les enregistrements DNS du domaine `attractive-store.com` :

```txt
A    @      76.13.192.125
A    www    76.13.192.125
A    api    76.13.192.125
```

## Structure VPS

Installer les outils si le VPS est neuf :

```bash
apt update
apt install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker nginx
```

```bash
mkdir -p /opt/attractive/api-src
mkdir -p /opt/attractive/web-src
```

Copier le backend dans `/opt/attractive/api-src` et le frontend dans `/opt/attractive/web-src`.

## Environnements

```bash
cp /opt/attractive/web-src/deployment/hostinger/.env.api.example /opt/attractive/.env.api
cp /opt/attractive/web-src/deployment/hostinger/.env.web.example /opt/attractive/.env.web
cp /opt/attractive/web-src/deployment/hostinger/.env.db.example /opt/attractive/.env.db
nano /opt/attractive/.env.api
nano /opt/attractive/.env.web
nano /opt/attractive/.env.db
```

À modifier obligatoirement dans `/opt/attractive/.env.api` :

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `AdminSeed__Email`
- `AdminSeed__Password`

À modifier aussi dans `/opt/attractive/.env.db` :

- `POSTGRES_PASSWORD`

Le même mot de passe doit être utilisé dans :

- `/opt/attractive/.env.db` → `POSTGRES_PASSWORD`
- `/opt/attractive/.env.api` → `ConnectionStrings__DefaultConnection`

## Docker

```bash
cd /opt/attractive/web-src/deployment/hostinger
docker compose up -d --build
docker ps
```

## Migration base de données

L'API applique automatiquement les migrations EF Core au démarrage.
Après `docker compose up -d --build`, vérifier les logs :

```bash
docker logs attractive-api --tail=100
```

## Nginx

```bash
cp /opt/attractive/web-src/deployment/hostinger/nginx-attractive.conf /etc/nginx/sites-available/attractive-store.com
ln -s /etc/nginx/sites-available/attractive-store.com /etc/nginx/sites-enabled/attractive-store.com
nginx -t
systemctl reload nginx
```

## SSL

```bash
certbot --nginx -d attractive-store.com -d www.attractive-store.com -d api.attractive-store.com
```

## Logs

```bash
docker logs attractive-api --tail=100
docker logs attractive-web --tail=100
```
