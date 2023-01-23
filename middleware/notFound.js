const notFound = (req, res) => res.status(404).send("Rout doesn't exist");

module.exports = notFound;
