const handler = (event, context, callback) => {
  callback(null, { message: event.message });
};

export default handler;
