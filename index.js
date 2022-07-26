const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");

//database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados");
  })
  .catch((msgError) => {
    console.error(msgError);
  });

// EJS como view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// BodyParser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      res.render("pergunta");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
