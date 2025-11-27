function status(request, response) {
  response.status(200).json({ message: "Deu tudo certo." });
}

export default status;
