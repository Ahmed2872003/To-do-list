import "./axios.js";

const getServerPublickKey = async () => {
  const { data } = await axios.get("/keys/public");

  return data;
};

export default { getServerPublickKey };
