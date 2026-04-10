// Funciones utilitarias generales

// Formatear fecha para MySQL DATETIME
export const formatDateForMySQL = (date = new Date()) => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

// Generar ID único (timestamp + random)
export const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Sanitizar string para prevenir SQL injection básico
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/['"`;]/g, '');
};

// Respuesta exitosa estandarizada
export const successResponse = (data, message = 'Operación exitosa') => {
  return {
    success: true,
    message,
    data
  };
};

// Respuesta de error estandarizada
export const errorResponse = (error, message = 'Error en la operación') => {
  return {
    success: false,
    message,
    error: error.message || error
  };
};

// Pagination helper
export const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};
