import jwt from 'jsonwebtoken';

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

// Middleware para CORS adicional si es necesario
export const corsConfig = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware para manejo de errores async
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Clave secreta para JWT (en producción debe estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'adrenalina-extrema-secret-key-2024';

// Middleware de autenticación - Verifica JWT
export const authenticateToken = (req, res, next) => {
  // Obtener token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado. No se proporcionó token de autenticación.' 
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = {
      idPersona: decoded.idPersona,
      email: decoded.email,
      rol: decoded.rol,
      nombre: decoded.nombre
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(403).json({ 
      error: 'Token inválido.' 
    });
  }
};

// Middleware de autorización por rol - Verifica roles permitidos
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Este middleware debe usarse DESPUÉS de authenticateToken
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado.' 
      });
    }

    // Log para debugging
    console.log('[requireRole] User:', req.user.email, 'Role:', req.user.rol, 'Allowed:', allowedRoles);

    // Normalizar el rol para soportar variantes (profe, profesora, coach)
    const normalizedUserRole = req.user.rol?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    // Mapeo de roles equivalentes
    const roleAliases = {
      'profe': 'profesora',
      'profesor': 'profesora',
      'teacher': 'profesora',
      'entrenador': 'coach',
      'trainer': 'coach'
    };
    
    // Obtener el rol normalizado o su alias
    const effectiveRole = roleAliases[normalizedUserRole] || normalizedUserRole;
    
    // Verificar si el rol del usuario está en los roles permitidos
    if (!normalizedAllowedRoles.includes(effectiveRole)) {
      console.log('[requireRole] DENIED - User role:', req.user.rol, 'Normalized:', effectiveRole, 'Required:', allowedRoles);
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso.',
        requiredRoles: allowedRoles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

// Middleware especial: permite a coaches ver cualquier alumno, o a un alumno ver solo sus propios datos
export const requireCoachOrSelf = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Usuario no autenticado.' 
    });
  }

  const normalizedUserRole = req.user.rol?.toLowerCase();
  const roleAliases = {
    'profe': 'profesora',
    'profesor': 'profesora',
    'teacher': 'profesora',
    'entrenador': 'coach',
    'trainer': 'coach'
  };
  const effectiveRole = roleAliases[normalizedUserRole] || normalizedUserRole;

  // Si es coach o profesora, permitir acceso a cualquier alumno
  if (effectiveRole === 'profesora' || effectiveRole === 'coach') {
    console.log('[requireCoachOrSelf] ALLOWED - User is coach/profesora');
    return next();
  }

  // Si es alumno, solo permitir acceso a sus propios datos
  const idAlumno = parseInt(req.params.idAlumno);
  if (req.user.idPersona === idAlumno) {
    console.log('[requireCoachOrSelf] ALLOWED - User accessing own data');
    return next();
  }

  console.log('[requireCoachOrSelf] DENIED - User:', req.user.idPersona, 'trying to access:', idAlumno);
  return res.status(403).json({ 
    error: 'No tienes permisos para acceder a este recurso.'
  });
};

// Función helper para generar JWT
export const generateToken = (persona) => {
  return jwt.sign(
    {
      idPersona: persona.idPersona,
      email: persona.mail,
      rol: persona.rol,
      nombre: persona.nombre
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token válido por 7 días
  );
};
