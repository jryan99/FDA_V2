# FDA API

A Node.js REST API for managing and accessing FDA-related data.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Usage](#api-usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)
- [Contact](#contact)

---

## About

This project provides a RESTful API built with Node.js. It is designed to facilitate CRUD operations on FDA-related resources, interfacing with a SQLite database. The API is intended for developers and data analysts who need programmatic access to FDA data.

## Features

- RESTful endpoints for data access and management
- SQLite database integration (`myfdx.db`)
- Modular codebase (`server.js`, `accounts-api.js`)
- Easily extensible for additional endpoints

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)
- (Optional) [SQLite3](https://www.sqlite.org/index.html) tools for direct DB inspection

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/jryan99/API.git
    cd API
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Ensure `myfdx.db` is present in the root directory (or create your own).

### Running the API

Start the server with:
