# DeliFlow System Architecture & Design

This document outlines the high-level system architecture, data flow, and state management for the DeliFlow platform.

## High-Level Architecture Flowchart

```mermaid
graph TD
    %% Frontend Components
    subgraph Client [Frontend - React / Vite]
        UI[User Interface - Tailwind CSS]
        Scanner[html5-qrcode Mobile Scanner]
        State[React State / Polling Manager]
    end

    %% Backend Components
    subgraph Server [Backend - Flask / Python]
        API[Flask REST API]
        Auth[Role-Based Access Control]
        SM[Strict State Machine Logic]
    end

    %% Database
    subgraph DB [Database - PostgreSQL]
        Postgres[(PostgreSQL ORM - SQLAlchemy)]
    end

    %% Connections
    UI -->|HTTPS Requests| API
    Scanner -->|Verification Code| UI
    State -->|10s HTTP Polling| API
    API -->|Validation & Business Logic| SM
    SM -->|Read/Write Data| Postgres
