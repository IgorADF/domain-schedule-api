# Doc

## Como criar um novo campo entre entidades e models

Seguir os passos abaixo:

1. Adicionar prop na entidade em `domain/entities`
2. Criar migração para adicionar prop ao db
3. Adicionar prop no model em `core/database/models`
4. Adicionar prop nas funções de mapeamento em `core/database/entities-mappers`

## Migrations e Seeders

Devem ter a extesão `.cjs`

## Zod

Usado para:

1. Criar entidades
1. Criado nos mappers de entidades e models
1. Entrada de dados dos casos de uso
