const transform = msg => Object.assign({}, msg, {
  additionalValue: true
});

const handler = (event, context, callback) => {

  callback(null, { message: transform(event.message) });
};

export default handler;
