const admin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('403 Forbidden');
  }
};

export { admin };
