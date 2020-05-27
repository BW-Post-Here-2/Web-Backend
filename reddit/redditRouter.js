const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const authenticator = require("../auth/authenticator");

const db = require("../database/dbConfig");
