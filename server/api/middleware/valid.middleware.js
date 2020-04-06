module.exports = (schema, property) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validate(req[property]);

      if (validated.error) {
        console.log(validated.error.details);
        return res.status(400).json({ status: validated.error.details });
      }

      next();
    } catch (e) {
      return res.status(500).json({ status: e.message });
    };
  };
};
