const DataPacketType = {
  JSON: 1,
};

export const safeDecodeDataPacketJSON = (payload) => {
  if (payload[0] === DataPacketType.JSON) {
    try {
      return JSON.parse(new TextDecoder().decode(payload.slice(1)));
    } catch (error) {
      console.error("error decoding data packet into json", error);
    }
  }
};
