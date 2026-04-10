// Middleware para validar requests

// Validar que existan campos requeridos
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: `Campos requeridos faltantes: ${missing.join(', ')}` 
      });
    }
    next();
  };
};

// Validar formato de email
export const validateEmail = (req, res, next) => {
  if (req.body.mail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.mail)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }
  }
  next();
};

// Validar que el ID sea numérico
export const validateNumericId = (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID debe ser numérico' });
  }
  next();
};

// Validar rol de persona
export const validateRol = (req, res, next) => {
  if (req.body.rol) {
    const rolesValidos = ['alumno', 'entrenador', 'admin'];
    if (!rolesValidos.includes(req.body.rol)) {
      return res.status(400).json({ 
        error: `Rol inválido. Debe ser: ${rolesValidos.join(', ')}` 
      });
    }
  }
  next();
};
