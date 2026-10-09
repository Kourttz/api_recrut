
-----

# 📄 API Recrutamento & Seleção — NestJS + TypeScript

Este projeto é uma aplicação backend responsável pela **gestão do ciclo de vida de recrutamento**, englobando desde o cadastro de candidatos e construção de currículos detalhados (experiências, educação, skills) até a gestão de vagas e o fluxo de candidaturas.

Desenvolvido com foco em **arquitetura orientada a eventos** e **alta escalabilidade**, o sistema utiliza o **Kafka** para sincronização de dados (CDC) e mantém uma estrutura modular limpa. O projeto segue os princípios SOLID e utiliza TypeORM para uma camada de persistência robusta.

-----

## 🚀 Tecnologias Utilizadas

  - **NestJS** — Framework Node.js progressivo e modular
  - **TypeScript** — Tipagem estática para maior segurança e manutenibilidade
  - **TypeORM** — ORM para mapeamento objeto-relacional complexo (One-to-Many, Cascade)
  - **PostgreSQL** — Banco de dados relacional
  - **Kafka / KafkaJS** — Mensageria para integração assíncrona e CDC
  - **Docker** — Containerização do ambiente (API + Banco + Kafka)
  - **Swagger** — Documentação automática e interativa da API
  - **Dotenv** — Configuração de variáveis de ambiente
  - **Class Validator** — Validação robusta de DTOs e payloads

-----

## 📁 Estrutura de Pastas

```bash
api_recrutamento/
├── src/
│   ├── common/                 # Utilitários globais e filtros de exceção
│   ├── migrations/             # Histórico de alterações do esquema do banco
│   ├── modules/
│   │   ├── candidato_skill/    # Tabela associativa Candidato <-> Skill
│   │   ├── candidatos/         # Gestão completa de candidatos e currículos
│   │   ├── candidaturas/       # Processo de aplicação para vagas
│   │   ├── certificacao/       # Certificações dos candidatos
│   │   ├── educacao/           # Histórico acadêmico
│   │   ├── experiencia/        # Histórico profissional
│   │   ├── funcao_candidatura/ # Funções específicas na candidatura
│   │   ├── funcoes/            # Cadastro de funções corporativas
│   │   ├── idioma/             # Idiomas e níveis de fluência
│   │   ├── kafka/              # Serviço consumidor de tópicos (Integração)
│   │   ├── link/               # Links externos (Portfólio, LinkedIn)
│   │   ├── projeto/            # Projetos realizados pelo candidato
│   │   ├── skill/              # Catálogo de habilidades e competências
│   │   ├── status/             # Status gerais do fluxo
│   │   ├── status_agendado/    # Status de agendamentos futuros
│   │   ├── unidades/           # Unidades da empresa
│   │   ├── usuarios/           # Réplica de dados de usuários (via Kafka)
│   │   └── vagas/              # Gestão de oportunidades e requisitos
│   ├── seeds/
│   │   ├── candidatos.seed.ts  # População inicial de candidatos
│   │   ├── skill.seed.ts       # População inicial de skills
│   │   ├── vagas.seed.ts       # População inicial de vagas
│   │   └── seed.ts             # Script orquestrador de todos os seeds
│   ├── app.module.ts           # Módulo raiz e injeção de dependências
│   ├── main.ts                 # Ponto de entrada da aplicação
│   └── swagger.ts              # Configuração do Open API
├── docker-compose.yml          # Orquestração (App, DB, Kafka, Zookeeper)
├── Dockerfile                  # Imagem Docker da API
├── data-source.ts              # Configuração de conexão TypeORM
├── .env                        # Variáveis de ambiente
├── package.json                # Dependências e scripts
└── README.md

```

💡 Cada módulo segue a arquitetura limpa do NestJS, contendo **Controller**, **Service**, **Entity** e **DTOs** específicos, além da integração com o módulo global de **Kafka** quando necessário.



## 📦 Instalação e Execução

⚠️ Requer **Node.js v22.14.0** (ou superior) e **npm v10.8.2** (ou compatível)

1.  Clone o repositório

<!-- end list -->

```bash
git clone https://github.com/gitlab/workforce/api_recrut.git
```

2.  Instale as dependências

<!-- end list -->

```bash
npm install
```

3.  Configure as variáveis de ambiente no arquivo `.env`

<!-- end list -->

```env
    PORT=3000
    DATABASE_HOST=localhost
    DATABASE_PORT=1111
    DATABASE_USER=user
    DATABASE_PASSWORD=senha
    DATABASE_NAME=recrutamento_db
    # Configuração Kafka
    KAFKA_BROKERS=kafka:1111
    KAFKA_GROUP_ID=recrutamento-consumer
```

4.  **Rodar Migrações do Banco de Dados**
    Antes de iniciar o projeto, é necessário rodar a migração para criar o esquema do banco de dados.

    ```bash
    npm run migration:run  
    ```

5.  Inicie o servidor em modo desenvolvimento

<!-- end list -->

```bash
npm run start:dev
```

-----

## 🐳 Execução com Docker

Se você tiver o Docker instalado, pode usar o `docker-compose` para iniciar o projeto e o banco de dados facilmente.

1.  Inicie os containers

<!-- end list -->

```bash
docker-compose up -d
```

2.  Acesse a aplicação em `http://localhost:3000`. 
 - O serviço de Kafka iniciará o consumidor automaticamente.
 - O banco de dados estará pronto para receber conexões.

-----

## 🏗️ Build para Produção

```bash
npm run build
npm run start:prod
```

-----

## 📖 Documentação da API

Após iniciar o projeto, acesse:

```
http://localhost:3000/docs
```

A documentação é gerada automaticamente pelo **Swagger**, detalhando os schemas de entrada (ex: CriarCandidatoDto) e os modelos de resposta.

-----

## 🔄 Integração Kafka

Esta API possui um módulo dedicado (KafkaModule) que atua como Consumidor. Ele escuta tópicos de CDC (Change Data Capture) para manter a integridade dos dados e replicar alterações de outros microserviços.

Tópicos principais ouvidos:
- **gestao_usuarios_topic**: Sincronização de dados de usuários.
- **recrutamento_candidatos_topic**: Eventos de criação/atualização de candidatos.
- **recrutamento_experiencia_topic**: Histórico profissional.
- **recrutamento_skill_topic**: Catálogo de habilidades.

-----

## ✍️ Autor

Desenvolvido por **Renato**, focado na modernização do sistema de Recrutamento e Seleção utilizando arquitetura de microserviços e eventos.
