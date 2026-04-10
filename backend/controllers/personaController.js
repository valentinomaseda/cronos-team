import { Persona } from "../models/Persona.js";
import { enviarEmailConfirmacion } from "../utils/emailService.js";
import { generateToken } from "../middleware/common.js";
import bcrypt from "bcrypt";

export const personaController = {
  // GET /api/personas
  async getAll(req, res) {
    try {
      const personas = await Persona.findAll();
      res.json(personas);
    } catch (error) {
      console.error("Error al obtener personas:", error);
      res.status(500).json({ error: "Error al obtener personas" });
    }
  },

  // GET /api/personas/:id
  async getById(req, res) {
    try {
      const persona = await Persona.findById(req.params.id);
      if (!persona) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }
      res.json(persona);
    } catch (error) {
      console.error("Error al obtener persona:", error);
      res.status(500).json({ error: "Error al obtener persona" });
    }
  },

  // GET /api/personas/rol/:rol
  async getByRole(req, res) {
    try {
      const personas = await Persona.findByRole(req.params.rol);
      res.json(personas);
    } catch (error) {
      console.error("Error al obtener personas por rol:", error);
      res.status(500).json({ error: "Error al obtener personas" });
    }
  },

  // GET /api/personas/:id/rutinas
  async getRutinas(req, res) {
    try {
      const rutinas = await Persona.getRutinasAsignadas(req.params.id);
      res.json(rutinas);
    } catch (error) {
      console.error("Error al obtener rutinas:", error);
      res.status(500).json({ error: "Error al obtener rutinas" });
    }
  },

  // POST /api/personas
  async create(req, res) {
    try {
      // Validar que el email no esté duplicado
      const existingPersona = await Persona.findByEmail(req.body.mail);
      if (existingPersona) {
        return res
          .status(400)
          .json({ error: "Ya existe una persona con ese email" });
      }

      const result = await Persona.create(req.body);
      res.status(201).json({
        message: "Persona creada exitosamente",
        id: req.body.idPersona,
      });
    } catch (error) {
      console.error("Error al crear persona:", error);
      res.status(500).json({ error: "Error al crear persona" });
    }
  },

  // PUT /api/personas/:id
  async update(req, res) {
    try {
      const result = await Persona.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }
      res.json({ message: "Persona actualizada exitosamente" });
    } catch (error) {
      console.error("Error al actualizar persona:", error);
      res.status(500).json({ error: "Error al actualizar persona" });
    }
  },

  // DELETE /api/personas/:id
  async delete(req, res) {
    try {
      const result = await Persona.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }
      res.json({ message: "Persona eliminada exitosamente" });
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      res.status(500).json({ error: "Error al eliminar persona" });
    }
  },

  // POST /api/personas/register - Auto-registro de alumno con reclamación de cuenta
  async register(req, res) {
    try {
      const {
        email,
        password,
        name,
        gender,
        phone,
        weight,
        height,
        address,
        birthDate,
      } = req.body;

      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ error: "Email, contraseña y nombre son requeridos" });
      }

      // Verificar si ya existe una persona con ese email
      const existingPersona = await Persona.findByEmail(email);

      if (existingPersona) {
        // Si existe pero tiene la contraseña por defecto '123456', permitir "reclamar" la cuenta
        const hasDefaultPassword =
          existingPersona.password &&
          (await bcrypt.compare("123456", existingPersona.password));

        if (hasDefaultPassword) {
          const claimedPersona = await Persona.claimAccount(email, password);

          // Generar token JWT para la cuenta reclamada
          const token = generateToken(claimedPersona);

          return res.status(200).json({
            message: "Cuenta reclamada exitosamente",
            persona: {
              ...claimedPersona,
              token,
            },
          });
        } else {
          // Si ya tiene contraseña personalizada, es un duplicado
          return res
            .status(400)
            .json({
              error:
                "Ya existe una cuenta con ese email. Por favor, inicia sesión.",
            });
        }
      }

      // Si no existe, crear nueva persona
      const todasPersonas = await Persona.findAll();
      const newId = Math.max(0, ...todasPersonas.map((p) => p.idPersona)) + 1;

      const personaData = {
        idPersona: newId,
        nombre: name,
        mail: email,
        tel: phone || "",
        rol: "alumno",
        nivel: "Intermedio",
        genero: gender || "masculino",
        direccion: address || "",
        fechaNac: birthDate || null,
        peso: parseFloat(weight) || null,
        altura: parseFloat(height) || null,
        password: password,
        activo: true,
      };

      await Persona.create(personaData);

      // Enviar email de confirmación
      try {
        await enviarEmailConfirmacion({
          idPersona: newId,
          email: email,
          nombre: name,
        });
      } catch (emailError) {
        console.error("Error enviando email de confirmación:", emailError);
        // No fallar el registro si el email falla
      }

      res.status(201).json({
        message:
          "Registro exitoso. Por favor, verifica tu email para activar tu cuenta.",
        requiresEmailVerification: true,
        email: email,
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrarse" });
    }
  },

  // POST /api/personas/login - Autenticación con contraseña hasheada
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email y contraseña son requeridos" });
      }

      const resultado = await Persona.authenticate(email, password);

      if (!resultado.success) {
        if (resultado.error === "EMAIL_NOT_VERIFIED") {
          return res.status(403).json({
            error: "Email no verificado",
            errorCode: "EMAIL_NOT_VERIFIED",
            email: resultado.email,
            nombre: resultado.nombre,
          });
        }
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Generar token JWT
      const token = generateToken(resultado.persona);

      // Devolver persona con token
      res.json({
        ...resultado.persona,
        token,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  },

  // GET /api/profesora/alumnos - Paginación optimizada con ordenamiento inteligente
  async getAlumnosPaginados(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validar parámetros
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error: "Parámetros inválidos. page >= 1, 1 <= limit <= 100",
        });
      }

      // Obtener alumnos paginados y total
      const [alumnos, totalRecords] = await Promise.all([
        Persona.getAlumnosPaginados(page, limit),
        Persona.getAlumnosCount(),
      ]);

      // Calcular metadata de paginación
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        data: alumnos,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Error al obtener alumnos paginados:", error);
      res.status(500).json({ error: "Error al obtener alumnos" });
    }
  },
};
