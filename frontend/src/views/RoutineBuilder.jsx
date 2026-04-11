import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Dumbbell,
  List,
  Loader2,
  Edit2,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import CustomSelect from "../components/CustomSelect";

// Helper para formatear el nombre del tipo de ejercicio
const getTypeLabel = (type) => {
  const labels = {
    reps: "REPS",
    segundos: "SEGUNDOS",
    minutos: "MINUTOS",
    horas: "HORAS",
    km: "KM",
    metros: "METROS",
  };
  return labels[type] || type.toUpperCase();
};

// Helper para obtener la etiqueta del campo de valor
const getValueLabel = (type) => {
  const labels = {
    reps: "Repeticiones",
    segundos: "Segundos",
    minutos: "Minutos",
    horas: "Horas",
    km: "Kilómetros",
    metros: "Metros",
  };
  return labels[type] || "Cantidad";
};

// Helper para obtener la unidad abreviada
const getUnitShort = (type) => {
  const units = {
    reps: "reps",
    segundos: "seg",
    minutos: "min",
    horas: "h",
    km: "km",
    metros: "m",
  };
  return units[type] || type;
};

// Helper para extraer solo el número de un string como "5 km" -> 5
const parseNumericValue = (value) => {
  if (!value) return null;
  // Si es un número, retornarlo
  if (typeof value === "number") return value;
  // Si es string, extraer solo los dígitos
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0]) : null;
};

export default function RoutineBuilder() {
  const {
    exercises,
    saveRoutine,
    updateRoutine,
    deleteRoutine,
    savedRoutines,
    showAlert,
  } = useAppContext();
  const navigate = useNavigate();
  const [routineName, setRoutineName] = useState("");
  const [exerciseInstances, setExerciseInstances] = useState([]);
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    routineId: null,
    routineName: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const addExercise = () => {
    if (!exercises || exercises.length === 0) {
      showAlert("No hay ejercicios disponibles. Crea uno primero.", "warning");
      return;
    }

    const firstExercise = exercises[0];

    // Intentar usar distancia/duracion predeterminada, sino usar valor por defecto
    let defaultValue = 10; // Valor por defecto para reps
    if (firstExercise.defaultType !== "reps") {
      const distanciaValue = parseNumericValue(firstExercise.distancia);
      const duracionValue = parseNumericValue(firstExercise.duracion);
      defaultValue = distanciaValue || duracionValue || 30;
    }

    const newInstance = {
      id: Date.now(),
      exerciseId: firstExercise.id,
      name: firstExercise.name,
      type: firstExercise.defaultType,
      value: defaultValue,
      sets: firstExercise.defaultType === "reps" ? 3 : 1, // Solo ejercicios de reps tienen múltiples series
      distancia: firstExercise.distancia || null,
      duracion: firstExercise.duracion || null,
      descripcionIntervalo: firstExercise.descripcionIntervalo || null,
    };
    setExerciseInstances([...exerciseInstances, newInstance]);
  };

  const removeExercise = (id) => {
    setExerciseInstances(exerciseInstances.filter((ex) => ex.id !== id));
  };

  const updateExercise = (id, field, value) => {
    // Validar valores numéricos
    if ((field === "value" || field === "sets") && value !== "") {
      const numValue = field === "value" ? parseFloat(value) : parseInt(value);
      if (!isNaN(numValue) && numValue < (field === "value" ? 0 : 1)) {
        showAlert(
          `El valor debe ser mayor o igual a ${field === "value" ? 0 : 1}`,
          "warning",
        );
        return;
      }
    }

    setExerciseInstances(
      exerciseInstances.map((ex) => {
        if (ex.id === id) {
          if (field === "exerciseId") {
            const selectedExercise = exercises.find(
              (e) => e.id === parseInt(value),
            );

            // Calcular valor por defecto según tipo de ejercicio
            let defaultValue = 10;
            if (selectedExercise.defaultType !== "reps") {
              const distanciaValue = parseNumericValue(
                selectedExercise.distancia,
              );
              const duracionValue = parseNumericValue(
                selectedExercise.duracion,
              );
              defaultValue = distanciaValue || duracionValue || 30;
            }

            return {
              ...ex,
              exerciseId: selectedExercise.id,
              name: selectedExercise.name,
              type: selectedExercise.defaultType,
              value: defaultValue,
              sets: selectedExercise.defaultType === "reps" ? 3 : 1, // Ajustar sets según el tipo
              distancia: selectedExercise.distancia || null,
              duracion: selectedExercise.duracion || null,
              descripcionIntervalo:
                selectedExercise.descripcionIntervalo || null,
            };
          }
          return { ...ex, [field]: value };
        }
        return ex;
      }),
    );
  };

  const handleSave = async () => {
    if (!routineName.trim()) {
      showAlert("Por favor ingresa un nombre para la rutina", "warning");
      return;
    }
    if (exerciseInstances.length === 0) {
      showAlert("Agrega al menos un ejercicio", "warning");
      return;
    }

    // Validar que todos los valores sean válidos
    for (const exercise of exerciseInstances) {
      if (!exercise.value || exercise.value <= 0) {
        showAlert(
          "Todos los ejercicios deben tener valores mayores a 0",
          "warning",
        );
        return;
      }
      // Solo validar sets para ejercicios de tipo 'reps'
      if (exercise.type === "reps" && (!exercise.sets || exercise.sets < 1)) {
        showAlert(
          "Los ejercicios de repeticiones deben tener al menos 1 serie",
          "warning",
        );
        return;
      }
    }

    setSaving(true);
    try {
      const routinePayload = {
        name: routineName,
        exercises: exerciseInstances.map(({ id, ...rest }, idx) => ({
          ...rest,
          orden: rest.orden || idx + 1,
        })), // Remove temp IDs and add orden
        createdAt: new Date().toISOString(),
      };

      if (editingRoutineId) {
        // Actualizar rutina existente
        await updateRoutine(editingRoutineId, routinePayload);
        showAlert("Rutina actualizada exitosamente", "success");
      } else {
        // Guardar nueva rutina
        await saveRoutine(routinePayload);
        showAlert("Rutina guardada exitosamente", "success");
      }

      // Reset form
      setRoutineName("");
      setExerciseInstances([]);
      setEditingRoutineId(null);
    } catch (error) {
      console.error("Error al guardar/actualizar rutina:", error);
      showAlert(
        "Error al guardar la rutina: " + (error.message || "Error desconocido"),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const editRoutine = (routine) => {
    setEditingRoutineId(routine.id);
    setRoutineName(routine.name);
    // Mapear ejercicios a instancia editable
    const instances = (routine.exercises || []).map((ex, i) => ({
      id: Date.now() + i,
      exerciseId: ex.exerciseId || ex.id,
      name: ex.name,
      type: ex.type || ex.unidad || "reps",
      value: ex.value || ex.cantidad || 10,
      sets: ex.sets || ex.cantSets || 3,
      distancia: ex.distancia || null,
      duracion: ex.duracion || null,
      descripcionIntervalo: ex.descripcionIntervalo || null,
      orden: ex.orden || i + 1,
    }));
    setExerciseInstances(instances);
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingRoutineId(null);
    setRoutineName("");
    setExerciseInstances([]);
  };

  const handleDeleteRoutine = (routineId, routineName) => {
    setDeleteModal({ isOpen: true, routineId, routineName });
  };

  const confirmDeleteRoutine = async () => {
    setDeleting(true);
    try {
      await deleteRoutine(deleteModal.routineId);
      setDeleteModal({ isOpen: false, routineId: null, routineName: "" });
      showAlert("Rutina eliminada exitosamente", "success");
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
      showAlert(
        "Error al eliminar la rutina: " +
          (error.message || "Error desconocido"),
        "error",
      );
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, routineId: null, routineName: "" });
    }
  };

  const cancelDeleteRoutine = () => {
    setDeleteModal({ isOpen: false, routineId: null, routineName: "" });
  };

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Dumbbell className="text-brandBlue" size={28} strokeWidth={2.5} />
          <h2 className="font-display text-2xl text-text uppercase">
            Constructor de Rutinas
          </h2>
        </div>
        <button
          onClick={() => navigate("/agregar-ejercicio")}
          className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2 text-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          Añadir ejercicio
        </button>
      </div>
      <p className="text-sm text-text-muted">
        Armá rutinas por bloques, editalas y asignalas luego a tus alumnos.
      </p>

      {/* Panel de Creación */}
      <div className="surface-panel p-6 space-y-6">
        <div>
          <label className="label-dark">Nombre de la Rutina</label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Ej: HIIT Asfalto 5K"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <label className="label-dark mb-0">Bloques de Ejercicio</label>
          </div>

          {exerciseInstances.length === 0 ? (
            <button
              onClick={addExercise}
              className="w-full border-2 border-dashed border-border-accent rounded-lg p-10 text-center bg-background/40 hover:bg-brandBlue/5 transition-colors"
            >
              <Plus className="mx-auto mb-2 text-brandBlue" size={20} strokeWidth={2.5} />
              <p className="text-text-muted font-medium">
                Tocá aquí para agregar el primer bloque de trabajo.
              </p>
            </button>
          ) : (
            <div className="space-y-4">
              {exerciseInstances.map((instance, index) => (
                <div
                  key={instance.id}
                  className="surface-muted p-4 relative shadow-sm"
                >
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => removeExercise(instance.id)}
                      className="text-text-muted hover:text-brandBlue transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-text-muted uppercase mb-3 block">
                    Bloque {index + 1}
                  </span>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">
                        Ejercicio
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <CustomSelect
                          value={instance.exerciseId}
                          onChange={(e) =>
                            updateExercise(
                              instance.id,
                              "exerciseId",
                              e.target.value,
                            )
                          }
                          options={exercises.map((ex) => ({
                            value: ex.id,
                            label: ex.name,
                          }))}
                        />
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-bg text-brandBlue rounded-md text-xs font-bold shrink-0">
                          {getTypeLabel(instance.type)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`grid ${instance.type === "reps" ? "grid-cols-2" : "grid-cols-1"} gap-3`}
                    >
                      <div>
                        <label className="block text-xs font-semibold text-text mb-1">
                          {getValueLabel(instance.type)}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={instance.value}
                          onChange={(e) =>
                            updateExercise(
                              instance.id,
                              "value",
                              e.target.value === ""
                                ? ""
                                : parseFloat(e.target.value),
                            )
                          }
                        />
                      </div>
                      {instance.type === "reps" && (
                        <div>
                          <label className="block text-xs font-semibold text-text mb-1">
                            Series
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={instance.sets}
                            onChange={(e) =>
                              updateExercise(
                                instance.id,
                                "sets",
                                e.target.value === ""
                                  ? ""
                                  : parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={addExercise}
            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 text-brandBlue font-bold py-2 px-4 rounded-md border border-border hover:bg-brandBlue/10 transition-colors"
          >
            <Plus size={18} strokeWidth={2.5} />
            Agregar ejercicio
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary text-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Save size={24} />
          )}
          <span>
            {editingRoutineId ? "Actualizar Rutina" : "Guardar Rutina"}
          </span>
        </button>
      </div>

      {/* Listado de Rutinas Guardadas */}
      <div className="surface-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <List className="text-brandBlue" size={20} />
            <h3 className="text-lg font-bold text-text">Rutinas Guardadas</h3>
          </div>
          <span className="text-xs font-bold text-brandBlue bg-bg px-3 py-1 rounded-full border border-border">
            {savedRoutines?.length || 0}
          </span>
        </div>

        {!savedRoutines || savedRoutines.length === 0 ? (
          <div className="border-2 border-dashed border-border-accent rounded-lg p-8 text-center bg-background/40">
            <p className="text-text-muted font-medium">
              Aún no hay rutinas guardadas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedRoutines.map((routine) => (
              <div
                key={routine.id}
                className="surface-muted p-4 space-y-3 hover:border-brandBlue/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-text truncate">
                      {routine.name}
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      {routine.exercises?.length || 0} ejercicios
                      {routine.createdAt
                        ? ` · ${new Date(routine.createdAt).toLocaleDateString("es-ES")}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => editRoutine(routine)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-bg text-brandBlue border border-border hover:bg-brandBlue/10 transition-colors text-xs font-semibold"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id, routine.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-bg text-brandBlue border border-border hover:bg-brandBlue/10 transition-colors text-xs font-semibold"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>

                {routine.exercises?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {routine.exercises.slice(0, 4).map((exercise, idx) => (
                      <span
                        key={`${routine.id}-${idx}`}
                        className="px-2 py-1 rounded-md bg-bg text-text text-xs border border-border"
                      >
                        {exercise.name} · {exercise.value || exercise.cantidad} {getUnitShort(exercise.type || exercise.unidad || "reps")}
                      </span>
                    ))}
                    {routine.exercises.length > 4 && (
                      <span className="px-2 py-1 rounded-md bg-bg text-text-muted text-xs border border-border">
                        +{routine.exercises.length - 4} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeleteRoutine}
        title="Eliminar rutina"
        message={`¿Seguro que querés eliminar la rutina \"${deleteModal.routineName}\"?`}
        type="warning"
        buttons={[
          {
            label: "Cancelar",
            variant: "secondary",
            onClick: cancelDeleteRoutine,
            disabled: deleting,
          },
          {
            label: deleting ? "Eliminando..." : "Eliminar",
            variant: "danger",
            onClick: confirmDeleteRoutine,
            loading: deleting,
            disabled: deleting,
          },
        ]}
      />

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-bg-surface border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-bg-surface border-b border-border p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-bold text-text">Editar rutina</h3>
              <button
                onClick={cancelEdit}
                className="text-text-muted hover:text-text transition-colors text-sm font-semibold"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="label-dark">Nombre de la Rutina</label>
                <input
                  type="text"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  placeholder="Ej: HIIT Asfalto 5K"
                />
              </div>

              <div>
                <div className="mb-4 border-b border-border pb-2">
                  <label className="label-dark mb-0">Bloques de Ejercicio</label>
                </div>

                {exerciseInstances.length === 0 ? (
                  <button
                    onClick={addExercise}
                    className="w-full border-2 border-dashed border-border-accent rounded-lg p-10 text-center bg-background/40 hover:bg-brandBlue/5 transition-colors"
                  >
                    <Plus className="mx-auto mb-2 text-brandBlue" size={20} strokeWidth={2.5} />
                    <p className="text-text-muted font-medium">
                      Tocá aquí para agregar el primer bloque de trabajo.
                    </p>
                  </button>
                ) : (
                  <div className="space-y-4">
                    {exerciseInstances.map((instance, index) => (
                      <div
                        key={instance.id}
                        className="surface-muted p-4 relative shadow-sm"
                      >
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => removeExercise(instance.id)}
                            className="text-text-muted hover:text-brandBlue transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-text-muted uppercase mb-3 block">
                          Bloque {index + 1}
                        </span>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-text mb-1">
                              Ejercicio
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <CustomSelect
                                value={instance.exerciseId}
                                onChange={(e) =>
                                  updateExercise(
                                    instance.id,
                                    "exerciseId",
                                    e.target.value,
                                  )
                                }
                                options={exercises.map((ex) => ({
                                  value: ex.id,
                                  label: ex.name,
                                }))}
                              />
                              <span className="inline-flex items-center justify-center px-4 py-2 bg-bg text-brandBlue rounded-md text-xs font-bold shrink-0">
                                {getTypeLabel(instance.type)}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`grid ${instance.type === "reps" ? "grid-cols-2" : "grid-cols-1"} gap-3`}
                          >
                            <div>
                              <label className="block text-xs font-semibold text-text mb-1">
                                {getValueLabel(instance.type)}
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={instance.value}
                                onChange={(e) =>
                                  updateExercise(
                                    instance.id,
                                    "value",
                                    e.target.value === ""
                                      ? ""
                                      : parseFloat(e.target.value),
                                  )
                                }
                              />
                            </div>
                            {instance.type === "reps" && (
                              <div>
                                <label className="block text-xs font-semibold text-text mb-1">
                                  Series
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={instance.sets}
                                  onChange={(e) =>
                                    updateExercise(
                                      instance.id,
                                      "sets",
                                      e.target.value === ""
                                        ? ""
                                        : parseInt(e.target.value),
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={addExercise}
                  className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 text-brandBlue font-bold py-2 px-4 rounded-md border border-border hover:bg-brandBlue/10 transition-colors"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Agregar ejercicio
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={cancelEdit}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
