const getPublicKey = async (req, res) => {
  res.json({
    publicKey: Buffer.from(process.env.SERVER_PUBLIC_KEY).toString("base64"),
  });
};

module.exports = { getPublicKey };
